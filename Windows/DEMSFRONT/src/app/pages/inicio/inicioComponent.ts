import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ModuloCardComponent } from '../../components/card/cardComponent';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeaderComponent, ModuloCardComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {
  nombreUsuario: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const usuarioActual = this.authService.getCurrentUser();
    if (usuarioActual) {
      this.nombreUsuario = usuarioActual.Nombre;
    }
  }
}
