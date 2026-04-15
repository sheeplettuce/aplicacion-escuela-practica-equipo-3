import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../components/button/buttonComponent';
import { InputComponent } from '../../components/input/inputComponent';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layoutComponent';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, InputComponent, AuthLayoutComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * Página de inicio de sesión de la app móvil.
 * Autentica al trabajador y almacena token/localStorage para la sesión.
 */
export class LoginPage {
  @ViewChild('inputUsuario') inputUsuario!: InputComponent;
  @ViewChild('inputContraseña') inputContraseña!: InputComponent;

  constructor(private api: ApiService, private router: Router, private toastController: ToastController) { }

  async presentToast(message: string, color: string = 'primary') {
    let icon = '';
    switch (color) {
      case 'success':
        icon = 'checkmark-circle';
        break;
      case 'danger':
        icon = 'close-circle';
        break;
      case 'warning':
        icon = 'warning';
        break;
      default:
        icon = 'information-circle';
        break;
    }

    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
      icon
    });
    toast.present();
  }

  onLogin() {
    const usuario = this.inputUsuario.getValue().trim();
    const contraseña = this.inputContraseña.getValue().trim();

    if (!usuario || !contraseña) {
      this.presentToast('Por favor ingresa usuario y contraseña.', 'warning');
      return;
    }

    const payload = {
      Nombre: usuario,
      Contra: contraseña
    };

    this.api.post('/trabajadores/login', payload).subscribe({
      next: (res: any) => {
        const body = res.body;
        console.log('Respuesta del login:', JSON.stringify(body));
        const trabajador = body?.trabajador;
        const token = body?.token;
        if (trabajador && token && trabajador.Rol === 'Mesero') {
          localStorage.setItem('trabajador', JSON.stringify(trabajador));
          localStorage.setItem('token', token);
          this.presentToast('Login exitoso', 'success');

          this.router.navigate(['/home']);
        } else {
          if (trabajador.Rol !== 'Administrador' && trabajador.Rol !== 'Cocina') {
            this.presentToast('Error: no se recibió información del trabajador', 'danger');
          }
        }
      },
      error: (err) => {
        this.presentToast(err.error?.error || 'Error en login', 'danger');
      }
    });
  }
}

