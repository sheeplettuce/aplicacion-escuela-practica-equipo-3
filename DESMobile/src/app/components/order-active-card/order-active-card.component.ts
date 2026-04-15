import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-order-active-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './order-active-card.component.html',
  styleUrls: ['./order-active-card.component.scss'],
})
export class OrderActiveCardComponent {
  @Input({ required: true }) deskLabel!: string;
  @Input({ required: true }) amount!: string;
  @Input({ required: true }) detail!: string;
  @Input() status: 'Proceso' | 'Listo' = 'Proceso';
  @Input() last = false;
}
