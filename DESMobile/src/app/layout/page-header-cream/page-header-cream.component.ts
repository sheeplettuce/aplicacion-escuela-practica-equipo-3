import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-header-cream',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle],
  templateUrl: './page-header-cream.component.html',
  styleUrls: ['./page-header-cream.component.scss'],
})
export class PageHeaderCreamComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) imageSrc!: string;
  @Input() imageAlt = '';
}
