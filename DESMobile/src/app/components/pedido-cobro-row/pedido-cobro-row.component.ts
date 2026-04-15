import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedido-cobro-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-cobro-row.component.html',
  styleUrls: ['./pedido-cobro-row.component.scss']
})
export class PedidoCobroRowComponent {
  @Input({ required: true }) code!: string;
  @Input({ required: true }) location: string = '';
  @Input({ required: true }) dishes!: number;
  @Input({ required: true }) price!: number;
  @Input({ required: true }) iconSrc!: string;
}
