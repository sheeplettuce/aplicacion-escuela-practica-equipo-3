import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.html',
  styleUrls: ['./input.css']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() isPasswordToggle: boolean = false;
  @Output() enterPressed = new EventEmitter<void>();
  @ViewChild('inputElement') inputElement!: ElementRef;

  hide = true;

  togglePassword() {
    this.hide = !this.hide;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enterPressed.emit();
    }
  }

  get inputType(): string {
    if (this.isPasswordToggle) {
      return this.hide ? 'password' : 'text';
    }
    return this.type;
  }

  getValue(): string {
    return this.inputElement?.nativeElement?.value || '';
  }

  setValue(value: string): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = value;
    }
  }

  clear(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }
  }
}