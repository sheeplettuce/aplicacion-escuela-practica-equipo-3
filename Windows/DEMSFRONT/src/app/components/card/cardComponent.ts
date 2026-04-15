import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-modulo-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class ModuloCardComponent {
  @Input() icono: string = '';         // ruta de la imagen
  @Input() nombre: string = '';        // título del módulo
  @Input() descripcion: string = '';   // texto debajo del título
  @Input() ruta: string = '/';         // ruta de navegación
  @Input() ancho: string = '302px';    // ancho personalizable
  @Input() padding: string = '53px 54px'; // padding personalizable
}
