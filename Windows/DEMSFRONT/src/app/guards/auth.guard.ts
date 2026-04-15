import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda que protege rutas del backend.
 * Verifica autenticación y roles permitidos por ruta.
 */
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const rol = auth.getRol();
  const rolesPermitidos = route.data?.['roles'] as string[]; // Manejar roles por ruta UwU
  if (rolesPermitidos && !rolesPermitidos.includes(rol || '')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};