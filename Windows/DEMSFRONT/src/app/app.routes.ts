/**
 * Rutas de la aplicación web Angular.
 *
 * Define las páginas principales de administración y usa guardas de ruta para
 * controlar el acceso según si el usuario está autenticado y su rol.
 */
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { LoginComponent } from './pages/login/LoginComponent';
import { MenuComponent } from './pages/menu/menuComponent';
import { RegistroPlatilloComponent } from './components/registro-platillo-component/registro-platillo-component';
import { InicioComponent } from './pages/inicio/inicioComponent';
import { CocinaComponent } from './pages/cocina/cocinaComponent';
import { MeseroComponent } from './pages/mesero/meseroComponent';
import { ReservacionesComponent } from './pages/reservacion/reservacionesComponent';
import { TrabajadoresComponent } from './pages/trabajadores/trabajadoresComponent';
import { RegistroTrabajadorComponent } from './components/registro-trabajador-component/registro-trabajador-component';
import { ReportesComponent } from './pages/reportes/reportesComponent';
import { Cuerre } from './pages/cuerre/cuerre';

export const routes: Routes = [
  { path: '',      component: LoginComponent, canActivate: [loginGuard] }, // 👈
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // 👈
  { path: 'inicio',                  component: InicioComponent,             canActivate: [authGuard], data: {roles: ['Administrador']} },
  { path: 'menu',                    component: MenuComponent,               canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'registro-platillo',       component: RegistroPlatilloComponent,   canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'registro-platillo/:id',   component: RegistroPlatilloComponent,   canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'cocina',                  component: CocinaComponent,             canActivate: [authGuard], data: {roles: ['Administrador', 'Cocina']}  },
  //{ path: 'mesero',                  component: MeseroComponent,             canActivate: [authGuard], data: {roles: ['Administrador']}  }, // QUE LOS MESEROS NO VAN AKI LTPM
  { path: 'reservaciones',           component: ReservacionesComponent,      canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'trabajadores',            component: TrabajadoresComponent,       canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'registro-trabajador',     component: RegistroTrabajadorComponent, canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'registro-trabajador/:id', component: RegistroTrabajadorComponent, canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'reportes',                component: ReportesComponent,           canActivate: [authGuard], data: {roles: ['Administrador']}  },
  { path: 'cuerre',                component: Cuerre,           canActivate: [authGuard], data: {roles: ['Administrador']}  },
];