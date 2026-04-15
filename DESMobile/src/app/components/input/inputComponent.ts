import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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
  @Input() type: string = 'text'; // 'text', 'password', 'email', etc.
  @Input() isPasswordToggle: boolean = false; // Nueva propiedad
  @ViewChild('inputElement') inputElement!: ElementRef;

  hide = true;

  togglePassword() {
    this.hide = !this.hide;
  }

  // Determina el tipo actual del input dinámicamente
  get inputType(): string {
    if (this.isPasswordToggle) {
      return this.hide ? 'password' : 'text';
    }
    return this.type;
  }

  // Método para obtener el valor del input
  getValue(): string {
    return this.inputElement?.nativeElement?.value || '';
  }

  // Método para establecer el valor del input
  setValue(value: string): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = value;
    }
  }

  // Método para limpiar el input
  clear(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }
  }
}