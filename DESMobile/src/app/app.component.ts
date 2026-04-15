import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ConfigService } from './services/config.service';
import { BackButtonService } from './services/back-button.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet
  ]
})
export class AppComponent {

  constructor(
    private config: ConfigService,
    private router: Router,
    private backButtonService: BackButtonService
  ) {
    this.checkConfig();
  }

  async checkConfig() {
    const configured = await this.config.isConfigured();
    const token = localStorage.getItem('token');

    if (!configured) {
      this.router.navigate(['/setup']);
    } else if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}