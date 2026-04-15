import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent {
  @Input({ required: true }) label!: string;
  /** inset: full width with horizontal page padding; centered: cobrar-style */
  @Input() widthMode: 'inset' | 'centered' = 'inset';
  @Input() padding: 'comfortable' | 'wide' | 'compact' = 'comfortable';
  @Input() labelSize: 'body' | 'title' = 'title';

  @Output() pressed = new EventEmitter<void>();

  onClick(): void {
    this.pressed.emit();
  }
}
