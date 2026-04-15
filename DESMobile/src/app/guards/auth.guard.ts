import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const trabajador = localStorage.getItem('trabajador');

  if (!token || !trabajador) {
    router.navigate(['/login']);
    return false;
  }

  const trabajadorObj = JSON.parse(trabajador);
  console.log('Trabajador en authGuard:', JSON.stringify(trabajadorObj));
  if (trabajadorObj.Rol !== 'Mesero') {
    alert('Acceso denegado: solo los meseros pueden acceder a esta sección.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};