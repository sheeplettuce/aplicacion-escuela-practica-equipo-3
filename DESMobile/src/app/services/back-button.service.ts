// back-button.service.ts
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BackButtonService {
  private navigationHistory: string[] = [];

  constructor(private platform: Platform, private router: Router) {
    this.init();
    this.watchRouteHistory();
  }

  private watchRouteHistory(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        if (!this.navigationHistory.length || this.navigationHistory[this.navigationHistory.length - 1] !== url) {
          this.navigationHistory.push(url);
        }
      });
  }

  private async init() {
    this.platform.backButton.subscribeWithPriority(9999, async (processNextHandler) => {
      const currentUrl = this.router.url;

      // Evitar regresar al login
      if (currentUrl.includes('login')) {
        processNextHandler();
        return;
      }

      // Regresar a la página anterior con reconstrucción completa
      if (this.navigationHistory.length > 1) {

        await this.router.navigateByUrl('/home', {
          replaceUrl: true,
          state: { reload: Date.now() }
        });

        return;
      }

      processNextHandler();
    });
  }
}