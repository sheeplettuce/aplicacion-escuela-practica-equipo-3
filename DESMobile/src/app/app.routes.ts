/**
 * Rutas de la aplicación móvil Ionic.
 *
 * Cada entrada define una página cargada de forma perezosa y, cuando es
 * necesario, se protege con `authGuard` para usuarios autenticados.
 */
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup.page').then(m => m.SetupPage),
  },
  {
    path: 'new-pedido',
    loadComponent: () => import('./pages/agr-ed-pedido/agr-ed-pedido.page').then((m) => m.AgrEdPedidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'agr-ed-pedido',
    loadComponent: () => import('./pages/agr-ed-pedido/agr-ed-pedido.page').then( m => m.AgrEdPedidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'cobrar-pedido',
    loadComponent: () => import('./pages/cobrar-pedido/cobrar-pedido.page').then( m => m.CobrarPedidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'reservaciones',
    loadComponent: () => import('./pages/reservaciones/reservaciones.page').then( m => m.ReservacionesPage),
    canActivate: [authGuard]
  },
  {
    path: 'editar-pedidos',
    loadComponent: () => import('./pages/editar-pedidos/editar-pedidos.page').then( m => m.EditarPedidosPage),
    canActivate: [authGuard]

  },
  {
    path: 'pedidos-acobrar',
    loadComponent: () => import('./pages/pedidos-acobrar/pedidos-acobrar.page').then( m => m.PedidosACobrarPage),
    canActivate: [authGuard]
  }
];