import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choice-split-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choice-split-buttons.component.html',
  styleUrls: ['./choice-split-buttons.component.scss'],
})
export class ChoiceSplitButtonsComponent {
  @Input() selected: 'local' | 'pickup' = 'local';
  @Output() primaryClick = new EventEmitter<'local' | 'pickup'>();
  @Output() secondaryClick = new EventEmitter<'local' | 'pickup'>();

  selectLocal(): void {
    this.selected = 'local';
    this.primaryClick.emit(this.selected);
  }

  selectPickup(): void {
    this.selected = 'pickup';
    this.secondaryClick.emit(this.selected);
  }
}
