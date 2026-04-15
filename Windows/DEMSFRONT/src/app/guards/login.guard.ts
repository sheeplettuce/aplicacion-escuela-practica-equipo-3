import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda que evita que un usuario autenticado vuelva al login.
 * Redirige según el rol si ya está conectado.
 */
export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    const rol = auth.getRol();
    // hay q usar roles ya uwu
    if (rol === 'Administrador') return router.parseUrl('/inicio');
    if (rol === 'Cocina') return router.parseUrl('/cocina');
    return false;
  }

  return true; // no está logueado, deja ver el login
};