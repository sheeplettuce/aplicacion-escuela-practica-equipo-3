import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-intro.component.html',
  styleUrls: ['./section-intro.component.scss'],
})
export class SectionIntroComponent {
  @Input({ required: true }) text!: string;
}
