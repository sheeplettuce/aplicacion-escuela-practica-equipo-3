import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  @Input() text: string = '';
}