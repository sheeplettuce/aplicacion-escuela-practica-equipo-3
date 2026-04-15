import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarIconButtonComponent } from '../toolbar-icon-button/toolbar-icon-button.component';

@Component({
  selector: 'app-dish-edit-row',
  standalone: true,
  imports: [CommonModule, ToolbarIconButtonComponent],
  templateUrl: './dish-edit-row.component.html',
  styleUrls: ['./dish-edit-row.component.scss'],
})
export class DishEditRowComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) quantity!: string;
  @Input({ required: true }) minusIconSrc!: string;
  @Input({ required: true }) plusIconSrc!: string;
  @Input({ required: true }) noteIconSrc!: string;
  @Input() noteShape: 'pill' | 'pill-wide' = 'pill-wide';
  @Input() leadingFlexSpacer = false;
  /** full = primera fila; wide = bebida; natural = pozole (sin crecer) */
  @Input() nameWidth: 'full' | 'wide' | 'natural' = 'full';

  @Output() noteClick = new EventEmitter<void>();
  @Output() minusClick = new EventEmitter<void>();
  @Output() plusClick = new EventEmitter<void>();
}
