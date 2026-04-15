import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elevated-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './elevated-panel.component.html',
  styleUrls: ['./elevated-panel.component.scss'],
})
export class ElevatedPanelComponent {
  @Input() preset:
    | 'agr-order-type'
    | 'agr-mesa'
    | 'agr-dishes'
    | 'cobrar-ticket'
    | 'none' = 'none';
}
