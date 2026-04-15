import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',   
  standalone: true,
  templateUrl: './card-menu.html',
  styleUrls: ['./card-menu.css']
})
export class CardComponent {
  @Input() imagen: string = '';
  @Input() nombre: string = '';
  @Input() precio: number = 0;
  @Input() descripcion: string = '';
  @Output() editar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();
}