# Documentación de Controladores

Este documento resume los controladores existentes en `Windows/DEMSBACK/src/controllers` y describe su funcionalidad clave.

## Índice

- `Menu.controller.js`
- `Pagos.controller.js`
- `Pedidos.controller.js`
- `Platillos.controller.js`
- `Trabajadores.controller.js`
- `Reportes.controller.js`
- `Reservaciones.controller.js`
- `Recordatorio.controller.js`

## Controladores y rutas

### `Menu.controller.js`

**Función principal**
- Generar el PDF del menú digital y devolver enlaces de visualización/descarga.

**Endpoints**
- `GET /menu/pdf`
  - Genera el PDF del menú usando el servicio de menú.
  - Retorna `secure_url`, `previewUrl`, `downloadUrl` y `publicId`.

### `Pagos.controller.js`

**Función principal**
- Gestionar pagos de pedidos, envío de tickets por correo y generación de tickets para impresión.

**Endpoints**
- `GET /pagos`
  - Devuelve todos los pagos registrados.
- `GET /pagos/:id`
  - Recupera un pago por su ID.
- `GET /pagos/pedido/:idPedido`
  - Obtiene los pagos asociados a un pedido específico.
- `POST /pagos`
  - Registra uno o varios pagos para un pedido.
  - Valida `idPedido`, que existan pagos y que cada pago tenga monto y método válidos.
- `POST /pagos/enviar-ticket`
  - Envía un ticket de venta por correo.
  - Verifica que exista `correo` y que la lista de `productos` sea válida.
- `POST /pagos/imprimir-ticket`
  - Genera un PDF de ticket para impresión local.
  - Crea un archivo temporal, prepara el PDF y lo borra al finalizar.

### `Pedidos.controller.js`

**Función principal**
- Administrar el ciclo de vida de los pedidos y enviar notificaciones SSE en tiempo real.

**Endpoints**
- `GET /pedidos`
  - Devuelve todos los pedidos.
- `GET /pedidos/:id/detalles`
  - Devuelve los detalles de un pedido específico.
- `POST /pedidos`
  - Crea un nuevo pedido.
  - Dispara el evento SSE `nuevo_pedido`.
- `PUT /pedidos/:id`
  - Actualiza un pedido existente.
  - Emite el evento SSE `pedido_actualizado`.
- `PUT /pedidos/:id/ready`
  - Marca un pedido como listo.
  - Emite el evento SSE `pedido_ready`.
- `PUT /pedidos/:id/finalizar`
  - Finaliza un pedido.
  - Emite el evento SSE `pedido_finalizado`.
- `PUT /pedidos/:id/cancelar`
  - Cancela un pedido si aún no fue finalizado.
  - Emite el evento SSE `pedido_cancelado`.

### `Platillos.controller.js`

**Función principal**
- Gestionar el catálogo de platillos y proporcionar datos para el menú digital.

**Endpoints**
- `GET /platillos`
  - Devuelve todos los platillos.
- `GET /platillos/completo`
  - Devuelve los platillos con información enriquecida.
- `GET /platillos/structure`
  - Devuelve la estructura de categorías o menú de platillos.
- `GET /platillos/menu`
  - Devuelve el menú digital para clientes.
- `GET /platillos/:id`
  - Recupera un platillo por su ID.
- `POST /platillos`
  - Crea un nuevo platillo.
- `PUT /platillos/:id`
  - Actualiza un platillo existente.
- `DELETE /platillos/:id`
  - Desactiva un platillo.

### `Trabajadores.controller.js`

**Función principal**
- Administrar usuarios/trabajadores del sistema y manejar autenticación con JWT.

**Endpoints**
- `GET /trabajadores`
  - Lista todos los trabajadores.
- `GET /trabajadores/structure`
  - Retorna la estructura de roles o tipos de trabajador.
- `GET /trabajadores/:id`
  - Obtiene los datos de un trabajador específico.
- `POST /trabajadores`
  - Crea un trabajador con contraseña cifrada.
- `PUT /trabajadores/:id`
  - Actualiza la información del trabajador y opcionalmente la contraseña.
- `DELETE /trabajadores/:id`
  - Desactiva al trabajador (baja lógica).
- `POST /trabajadores/login`
  - Valida credenciales y devuelve token JWT.

### `Reportes.controller.js`

**Función principal**
- Generar métricas de ventas y obtener el historial de cambios.

**Endpoints**
- `GET /reportes/resumen?desde=...&hasta=...`
  - Calcula total de ventas, ticket promedio, método de pago dominante y top de platillos.
- `GET /reportes/historial-cambios`
  - Devuelve el historial de cambios almacenado.

### `Reservaciones.controller.js`

**Función principal**
- Administrar reservaciones de clientes y notificar cambios con SSE.

**Endpoints**
- `GET /Reservaciones`
  - Lista todas las reservaciones.
- `GET /Reservaciones/proximas`
  - Devuelve las reservaciones próximas.
- `GET /Reservaciones/:id`
  - Recupera una reservación por ID.
- `POST /Reservaciones`
  - Crea una reservación nueva.
- `PUT /Reservaciones/:id`
  - Actualiza una reservación existente.
- `DELETE /Reservaciones/:id`
  - Elimina una reservación.

### `Recordatorio.controller.js`

**Función principal**
- Enviar correos de recordatorio y reenvío de tickets de pedidos.

**Endpoints**
- `POST /recordatorios/enviar`
  - Envía recordatorios por correo para reservaciones próximas.
- `POST /recordatorios/enviar-ticket/:id?correo=...`
  - Reenvía el ticket de un pedido al correo indicado.

## Controladores más importantes

1. `Pedidos.controller.js` - núcleo de la gestión de pedidos y notificaciones.
2. `Pagos.controller.js` - administrativo de pagos y tickets.
3. `Platillos.controller.js` - maneja el catálogo del menú y los datos mostrados al cliente.
4. `Trabajadores.controller.js` - gestiona usuarios y la autenticación.
5. `Reservaciones.controller.js` - gestiona las reservas de clientes.

## Notas finales

- Los otros controladores (`Menu`, `Reportes`, `Recordatorio`) son de soporte importante para funciones de menú, análisis y comunicación.
- La documentación en código ya fue mejorada con JSDoc y comentarios más claros.
