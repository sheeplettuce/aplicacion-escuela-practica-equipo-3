import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-row.component.html',
  styleUrls: ['./reservation-row.component.scss'],
})
export class ReservationRowComponent {
  /** Personas + tel en una fila vs tel aparte (tarjetas altas) */
  @Input() variant: 'inline-meta' | 'stacked-phone' = 'inline-meta';
  @Input({ required: true }) datePrimary!: string;
  @Input({ required: true }) dateSecondary!: string;
  @Input({ required: true }) title!: string;
  /** Líneas bajo el título cuando variant es inline-meta */
  @Input() metaLine1 = '';
  @Input() metaLine2 = '';
  /** Personas (variant stacked-phone) */
  @Input() personSummary = '';
  @Input() phone = '';
  @Input({ required: true }) actionIconSrc!: string;
  /** Margen inferior entre tarjetas */
  @Input() spacing: 'tight' | 'medium' | 'relaxed' | 'before-footer' = 'medium';
}
