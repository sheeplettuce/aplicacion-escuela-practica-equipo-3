import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-header-home',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonButton,],
  templateUrl: './page-header-home.component.html',
  styleUrls: ['./page-header-home.component.scss'],
})
export class PageHeaderHomeComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) badgeText!: string;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('trabajador');
    this.router.navigate(['/login']);
  }

}
