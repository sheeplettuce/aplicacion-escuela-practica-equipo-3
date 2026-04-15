import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.scss'],
})
export class PageBodyComponent {
  @Input() scrollVariant: 'default' | 'home' | 'reservaciones' = 'default';
}
