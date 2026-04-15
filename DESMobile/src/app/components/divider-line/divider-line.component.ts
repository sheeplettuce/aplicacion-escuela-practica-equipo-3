import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider-line.component.html',
  styleUrls: ['./divider-line.component.scss'],
})
export class DividerLineComponent {
  @Input() tone: 'soft' | 'emphasis' | 'section' = 'soft';
  @Input() spacing: 'normal' | 'tight-before-total' = 'normal';
}
