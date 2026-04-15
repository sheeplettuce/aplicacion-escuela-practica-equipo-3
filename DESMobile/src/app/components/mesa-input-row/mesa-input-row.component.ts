import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesa-input-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesa-input-row.component.html',
  styleUrls: ['./mesa-input-row.component.scss'],
})
export class MesaInputRowComponent {
  @Input() value: number | null = null;
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) trailingIconSrc!: string;
  @Output() mesaChange = new EventEmitter<number>();

  onInputChange(event: any) {
    const value = Number(event.target.value);
    this.value = value;
    this.mesaChange.emit(value);
  }
}
