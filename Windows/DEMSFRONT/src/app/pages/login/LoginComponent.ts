import { Component, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  @ViewChild('inputUsuario') inputUsuario!: InputComponent;
  @ViewChild('inputContraseña') inputContraseña!: InputComponent;

  isLoading = false;
  alerta: { tipo: 'error' | 'success'; mensaje: string } | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  cerrarAlerta() {
    this.alerta = null;
  }

  async onLogin() {
    if (this.isLoading) return;

    this.alerta = null;
    this.isLoading = true;

    const usuario = this.inputUsuario.getValue().trim();
    const contraseña = this.inputContraseña.getValue().trim();

    if (!usuario || !contraseña) {
      this.alerta = { tipo: 'error', mensaje: 'Por favor ingresa usuario y contraseña' };
      this.isLoading = false;
      return;
    }

    this.authService.login(usuario, contraseña).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.ngZone.run(() => {
          if (response?.trabajador) {
            const rol = response.trabajador.Rol;
            this.alerta = { tipo: 'success', mensaje: `Bienvenido, ${response.trabajador.Nombre}` };
            this.isLoading = false;
            this.cdr.detectChanges();

            setTimeout(() => {
              if (rol === 'Administrador') {
                this.router.navigate(['/inicio']);
              } else if (rol === 'Cocina') {
                this.router.navigate(['/cocina']);
              } else {
                alert('Acceso denegado.');
                this.authService.logout();
              }
            }, 1200);
          }
        });
      },
      error: (error) => {
        console.log('Error de login:', error);
        console.log('Status:', error?.status);
        this.ngZone.run(() => {
          const status = error?.status;
          let mensaje = 'Error al conectar con el servidor.';

          if (status === 401) {
            mensaje = 'Usuario o contraseña incorrectos.';
          } else if (status === 404) {
            mensaje = 'Usuario no encontrado.';
          } else if (status === 0) {
            mensaje = 'No se pudo conectar al servidor.';
          }

          console.log('Mostrando alerta:', mensaje);
          this.alerta = { tipo: 'error', mensaje };
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('isLoading puesto a false, alerta:', this.alerta);
        });
      }
    });
  }
}