# Documentación de la app web (Front)

## Visión general

Esta aplicación web Angular administra el sistema de restaurante desde el lado
de administración.
Se autentica con el backend y controla acceso según el rol del usuario.

La aplicación usa rutas Angular clásicas y una configuración de API cargada desde
`config.json` a través de `ConfigService`.

## Arquitectura principal

- Rutas definidas en `app.routes.ts`.
- Guardas de ruta basadas en estado de sesión y roles.
- Login con token almacenado en `localStorage`.
- Componentes y servicios separados por dominio: platillos, reservaciones, reportes, trabajadores.

## Rutas principales

- `/login`
  - Página de acceso.
  - Si ya hay sesión activa, redirige según el rol del usuario.
- `/inicio`
  - Dashboard para administradores.
- `/menu`
  - Gestor de menú del restaurante.
- `/registro-platillo`
  - Formulario para agregar un nuevo platillo.
- `/registro-platillo/:id`
  - Formulario para editar un platillo existente.
- `/cocina`
  - Vista de cocina para ver pedidos y su estado.
- `/reservaciones`
  - Gestión de reservaciones.
- `/trabajadores`
  - Panel administrativo de trabajadores.
- `/registro-trabajador`
  - Crear trabajador.
- `/registro-trabajador/:id`
  - Editar trabajador existente.
- `/reportes`
  - Informes y métricas.

## Servicios clave

- `AuthService`
  - `login(usuario, contraseña)` hace `POST /Trabajadores/login`.
  - Almacena `currentUser` y `token` en `localStorage`.
  - Ofrece `getCurrentUser()`, `getRol()`, `isLoggedIn()` y `logout()`.
- `ConfigService`
  - Carga archivos de configuración (`config.json`).
  - Proporciona la URL base de la API mediante `apiUrl`.
- `PlatillosService`
  - Consume endpoints del backend para manejar platillos.
- `ReservacionService`
  - Consume endpoints de reservaciones.
- `ReportesService`
  - Solicita datos de reportes y análisis.
- `TrabajadoresService`
  - Gestiona creación, edición y listado de trabajadores.

## Componentes principales

- `LoginComponent`
  - Maneja la autenticación del usuario.
  - Redirige a `/inicio` para Administrador y a `/cocina` para Cocina.
- `InicioComponent`
  - Muestra el nombre de usuario y panel de administración.
- `MenuComponent`
  - Administrador de menú.
- `CocinaComponent`
  - Vista para cocina.
- `ReservacionesComponent`
  - Gestión de reservaciones.
- `TrabajadoresComponent`
  - Administración de trabajadores.
- `RegistroPlatilloComponent`
  - Formulario para agregar/editar platillos.
- `RegistroTrabajadorComponent`
  - Formulario para crear/editar trabajadores.
- `ReportesComponent`
  - Muestra reportes y métricas.

## Guardas de ruta

- `authGuard`
  - Verifica que el usuario esté logueado.
  - Restringe acceso según los roles configurados en `route.data.roles`.
- `loginGuard`
  - Si el usuario ya está autenticado, evita ver `/login`.
  - Redirige según su rol.

## Flujo de autenticación

1. El usuario entra a `/login`.
2. `LoginComponent` usa `AuthService.login()`.
3. Si la respuesta es exitosa, se guarda el trabajador y el token.
4. Se redirige según `Rol`:
   - `Administrador` → `/inicio`
   - `Cocina` → `/cocina`
5. Las rutas protegidas validan el rol con `authGuard`.

## Comentarios técnicos

- La protección de rutas es esencial para separar accesos por rol.
- El backend es consumido mediante servicios especializados.
- `ConfigService` centraliza la URL base de la API para todas las peticiones.
