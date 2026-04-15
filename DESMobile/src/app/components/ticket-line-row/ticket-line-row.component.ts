import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-line-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-line-row.component.html',
  styleUrls: ['./ticket-line-row.component.scss'],
})
export class TicketLineRowComponent {
  @Input({ required: true }) description!: string;
  @Input({ required: true }) price!: string;
  @Input() tightRightMargin = false;
  @Input() flexDescription = false;
}
