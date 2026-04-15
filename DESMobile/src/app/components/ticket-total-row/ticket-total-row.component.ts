import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-total-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-total-row.component.html',
  styleUrls: ['./ticket-total-row.component.scss'],
})
export class TicketTotalRowComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) amount!: string;
}
