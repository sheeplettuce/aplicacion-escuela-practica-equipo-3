import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-brand-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-brand-header.component.html',
  styleUrls: ['./ticket-brand-header.component.scss'],
})
export class TicketBrandHeaderComponent {
  @Input({ required: true }) brand!: string;
  @Input({ required: true }) subheading!: string;
}
