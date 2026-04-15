import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-pedido-select-row',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './pedido-select-row.component.html',
  styleUrls: ['./pedido-select-row.component.scss'],
})
export class PedidoSelectRowComponent {
  @Input({ required: true }) code!: string;
  @Input({ required: true }) subtitle!: string;
  @Input() status: 'pending' | 'ready' = 'pending';
  @Input({ required: true }) trailingIconSrc!: string;
  /** Space below row — matches list / section separation in editar pedidos */
  @Input() spacing: 'list' | 'section-gap' | 'flush' = 'list';
}
