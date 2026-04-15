import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar-icon-button.component.html',
  styleUrls: ['./toolbar-icon-button.component.scss'],
})
export class ToolbarIconButtonComponent {
  @Input({ required: true }) iconSrc!: string;
  @Input({ required: true }) label!: string;
  @Input() shape: 'square' | 'pill' | 'pill-wide' = 'square';
  @Input() iconAlt = '';

  @Output() pressed = new EventEmitter<void>();
}
