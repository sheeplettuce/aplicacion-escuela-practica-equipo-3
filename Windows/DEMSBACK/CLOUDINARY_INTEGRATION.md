# Integración de Cloudinary para PDFs

## Descripción
Se ha integrado **Cloudinary** para almacenar y servir archivos PDF generados en la aplicación. Esto permite:

1. ✅ Generar PDFs en el backend (Menú, Tickets, etc.)
2. ✅ Subirlos automáticamente a Cloudinary
3. ✅ Obtener URLs para previsualizar o descargar
4. ✅ Verlos en navegadores sin instalar software adicional

---

## Configuración

Las credenciales ya están en el archivo `.env`:
```
CLOUDINARY_CLOUD_NAME=dtx8ht7or
CLOUDINARY_API_KEY=632395539913895
CLOUDINARY_API_SECRET=6QRKKZeqgRhfM09dRJ09UGj5LKk
```

---

## Problemas Comunes y Soluciones

### ❌ Error 401 (Unauthorized)
**Problema:** Los URLs retornan error 401 al intentar acceder

**Soluciones aplicadas:**
1. ✅ Cambiar `resource_type: 'raw'` - Correcto para PDFs
2. ✅ Usar endpoint `/raw/upload/` - Específico para archivos raw
3. ✅ Configurar `access_control` en uploads públicos
4. ✅ Logging mejorado para debug

**Si siguen fallando:**
- Verifica que las credenciales en `.env` sean correctas
- Comprueba que tu cuenta de Cloudinary tenga plan activo
- Prueba la credencial API Key en el dashboard de Cloudinary

---

#### `uploadPDFToCloudinary(fileBuffer, fileName, folder)`
Sube un PDF (como Buffer) a Cloudinary.

**Parámetros:**
- `fileBuffer` (Buffer): El contenido del PDF
- `fileName` (string): Nombre del archivo sin extensión
- `folder` (string): Carpeta en Cloudinary (default: 'dems')

**Retorna:**
```javascript
{
  url: 'https://res.cloudinary.com/dtx8ht7or/raw/upload/menus/menu-loma-bonita',
  secure_url: 'https://res.cloudinary.com/dtx8ht7or/raw/upload/menus/menu-loma-bonita',
  publicId: 'menus/menu-loma-bonita',
  previewUrl: 'https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_inline/menus/menu-loma-bonita',    // Ver PDF
  downloadUrl: 'https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_attachment/menus/menu-loma-bonita' // Descargar PDF
}
```

#### `getCloudinaryUrl(publicId, mode)`
Genera URLs especiales de Cloudinary.

**Parámetros:**
- `publicId` (string): ID del archivo en Cloudinary
- `mode` (string): 'inline' (previsualizar) o 'attachment' (descargar)

---

## 2. **Menu.service.js** - PDF del Menú

### `generarMenuPDF()`
Genera el menú completo y lo sube a Cloudinary automáticamente.

**Uso en Controlador:**
```javascript
import { generarMenuPDF } from '../services/Menu.service.js';

const getMenuPDF = async (_req, res) => {
    try {
        const urlData = await generarMenuPDF();
        res.status(200).json({
            message: 'PDF generado exitosamente',
            url: urlData.secure_url,
            previewUrl: urlData.previewUrl,
            downloadUrl: urlData.secure_url.replace('/upload/', '/upload/fl_attachment/'),
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
```

**Respuesta del endpoint GET /menu/pdf:**
```json
{
  "message": "PDF generado y subido exitosamente a Cloudinary",
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/dtx8ht7or/raw/upload/menus/menu-loma-bonita",
    "previewUrl": "https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_inline/menus/menu-loma-bonita",
    "downloadUrl": "https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_attachment/menus/menu-loma-bonita",
    "publicId": "menus/menu-loma-bonita"
  }
}
```

---

## 3. **generarTicket.js** - PDF de Tickets

### `generarTicket(pedido)` 
Sigue funcionando igual (retorna Buffer del PDF).

### `generarTicketYSubir(pedido)` ⭐ NUEVO
Genera el ticket y lo sube a Cloudinary automáticamente.

**Uso en Controlador o Servicio:**
```javascript
import { generarTicketYSubir } from '../utils/generarTicket.js';

const pedido = {
    nombre: 'Juan Pérez',
    correo: 'juan@example.com',
    fecha: new Date().toLocaleDateString(),
    productos: [
        { nombre: 'Enchiladas', precio: 120 },
        { nombre: 'Refresco', precio: 30 }
    ],
    total: 150
};

try {
    const urlData = await generarTicketYSubir(pedido);
    console.log('Ticket subido:', urlData.previewUrl);
    // Enviar email con el link
} catch (error) {
    console.error('Error al subir ticket:', error);
}
```

---

## 🔗 URLs con Flags Especiales de Cloudinary

Cloudinary permite modificar cómo se sirven los PDFs usando **flags**:

### Previsualizar (inline) - Ver en navegador
```
https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_inline/menus/menu-loma-bonita
```
✅ El PDF se abre en el navegador (no se descarga)

### Descargar (attachment) - Descargar al dispositivo
```
https://res.cloudinary.com/dtx8ht7or/raw/upload/fl_attachment/menus/menu-loma-bonita
```
✅ El PDF se descarga al dispositivo del usuario

### Sin flags (comportamiento por defecto)
```
https://res.cloudinary.com/dtx8ht7or/raw/upload/menus/menu-loma-bonita
```
⚠️ Depende del navegador (algunos descargan, otros muestran)

---

## 📧 Enviar PDF por Email

Si necesitas enviar el PDF por correo:

```javascript
import nodemailer from 'nodemailer';
import { generarMenuPDF } from '../services/Menu.service.js';

const enviarMenuPorEmail = async (email) => {
    try {
        // 1. Generar y subir PDF
        const urlData = await generarMenuPDF();
        
        // 2. Configurar email
        const transporter = nodemailer.createTransport({...});
        
        // 3. Enviar con link al PDF
        await transporter.sendMail({
            to: email,
            subject: 'Menú - Cenaduría Loma Bonita',
            html: `<p>Hola, aquí está el menú:</p>
                   <a href="${urlData.previewUrl}">Ver PDF</a>
                   <p><a href="${urlData.downloadUrl}">Descargar PDF</a></p>`
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
};
```

---

## Carpetas en Cloudinary

Los PDFs se organizan en carpetas:
- **`/menus/`** - Menús
- **`/tickets/`** - Tickets de compra
- **`/dems/`** - Otros documentos (por defecto)

Puedes agregar más carpetas según necesites.

---

## ⚠️ Limitaciones y Consideraciones

1. **Tamaño máximo**: Free plan de Cloudinary tiene límites (revisa tu plan)
2. **URLs públicas**: Los PDFs son accesibles sin autenticación (están en URLs públicas)
3. **Organización**: Los PDFs se guardan permanentemente en Cloudinary

---

## 🧪 Pruebas

### Endpoint para generar menú
```bash
GET http://localhost:5000/menu/pdf
```

Respuesta:
```json
{
  "previewUrl": "https://res.cloudinary.com/.../fl_inline/..."
}
```

### Desde el navegador
1. Abre la `previewUrl` para ver el PDF en línea
2. Abre la `downloadUrl` para descargarlo

---

## Próximas mejoras (opcionales)

- [ ] Versionar PDFs (guardar histórico)
- [ ] Eliminar PDFs antiguos de Cloudinary
- [ ] Generar certificados/reportes también
- [ ] Integrar con QR codes que apunten al PDF en Cloudinary
