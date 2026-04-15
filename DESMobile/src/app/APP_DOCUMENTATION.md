# Documentación de la app móvil

## Visión general

Esta es la aplicación móvil Ionic/Angular para el personal de restaurante.
Su objetivo principal es gestionar pedidos, cobrar, ver reservaciones y recibir
alertas en tiempo real cuando un pedido cambia de estado.

La app se conecta a un backend remoto a través de `ApiService` y obtiene la URL
base de la API desde `ConfigService`, almacenada en `Capacitor Preferences`.

## Arquitectura principal

- Rutas perezosas definidas en `app.routes.ts`.
- Autenticación simple basada en `localStorage` y roles de trabajador.
- Eventos en tiempo real recibidos por SSE desde `/sse/events`.
- Escenarios importantes:
  - Configuración de servidor por QR en `SetupPage`.
  - Login de trabajador en `LoginPage`.
  - Dashboard de pedidos en `HomePage`.

## Rutas principales

- `login`
  - Página de acceso.
  - Llama a `/trabajadores/login` en el backend.
  - Guarda `trabajador` y `token` en `localStorage`.
- `home`
  - Dashboard principal.
  - Muestra pedidos en proceso y pedidos listos.
  - Escucha eventos SSE de tipo `pedido_ready`.
- `setup`
  - Escanea un código QR con la URL del servidor.
  - Extrae y guarda la URL base de la API.
  - Registra el dispositivo con `POST /register`.
- `new-pedido` / `agr-ed-pedido`
  - Crear y editar pedidos.
- `cobrar-pedido`
  - Cobrar un pedido.
  - Envía información de pago al backend.
- `reservaciones`
  - Mostrar y gestionar reservaciones existentes.
- `editar-pedidos`
  - Editar pedidos ya creados.
- `pedidos-acobrar`
  - Listar pedidos pendientes de pago.

## Servicios clave

- `ApiService`
  - Método `post(endpoint, body)`:
    - Construye la URL base con `ConfigService.getApiUrl()`.
    - Envia `HttpClient.post(..., { observe: 'response' })`.
  - Método `get(endpoint)`:
    - Construye URL base y realiza `HttpClient.get()`.
  - Método `put(endpoint, body)`:
    - Construye URL base y realiza `HttpClient.put(..., { observe: 'response' })`.
  - Método `escucharEventos()`:
    - Crea un `EventSource` contra `/sse/events`.
    - Escucha eventos `pedido_ready` y reconecta tras errores.
- `ConfigService`
  - `setApiUrl(url)` guarda la URL en `Preferences`.
  - `getApiUrl()` recupera la URL configurada.
  - `isConfigured()` valida si la URL ya existe.
- `SseService`
  - Provee `connect(url)` que envuelve `EventSource` en un `Observable`.
  - Se asegura de ejecutar los callbacks dentro de `NgZone` para refrescar la UI.

## Páginas clave

- `LoginPage`
  - Valida usuario y contraseña.
  - Llama al backend en `/trabajadores/login`.
  - Si el trabajador es `Mesero`, guarda sesión y redirige a `home`.
- `HomePage`
  - Carga pedidos desde `GET /Pedidos/`.
  - Convierte los datos recibidos en objetos locales `Pedido`.
  - Actualiza listas `pedidosReady` y `pedidosPending`.
  - Recibe eventos SSE que marcan pedidos como `Listo`.
- `SetupPage`
  - Escanea un código QR para configurar la URL del backend.
  - Elimina `/login` de la URL si es necesario.
  - Registra el dispositivo con `POST /register`.
- `AgrEdPedidoPage`
  - Gestiona creación y edición de pedidos.
- `CobrarPedidoPage`
  - Envía la información de cobro al backend.
- `ReservacionesPage`
  - Presenta reservaciones y datos asociados.

## Guardas de ruta

- `authGuard`
  - Comprueba `token` y `trabajador` en `localStorage`.
  - Requiere que el trabajador tenga rol `Mesero`.
  - Redirige a `login` si no se cumple la condición.

## Comentarios técnicos

- La aplicación usa `EventSource` para recibir actualizaciones en tiempo real.
- `ConfigService` y `ApiService` separan la configuración de la URL de la API
  del consumo real de endpoints.
- El flujo de `setup` es crítico: sin él la app no conoce la URL de backend.
- La lógica de sesión es básica y no usa token bearer en headers directamente.
