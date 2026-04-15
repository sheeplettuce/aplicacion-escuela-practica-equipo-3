import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ConfigService } from '../../services/config.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContentHeadingComponent } from '../../components/content-heading/content-heading.component';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
  imports: [IonContent, IonButton, CommonModule, ContentHeadingComponent],
})
/**
 * Página de configuración inicial.
 * Escanea el código QR del servidor y guarda la URL base de la API.
 */
export class SetupPage {

  constructor(
    private config: ConfigService,
    private router: Router,
    private apiService: ApiService
  ) { }

  async scanQR() {
    const result = await BarcodeScanner.scan();

    if (result.barcodes.length > 0) {

      const barcode = result.barcodes[0];

      if (!barcode || !barcode.rawValue) {
        console.error("QR inválido");
        return;
      }

      const url = barcode.rawValue;
      console.log("QR:", url);

      // Guardar base URL (quitamos /login)
      const baseUrl = url.replace('/login', '');

      // Registrar dispositivo
      try {
        await this.config.setApiUrl(baseUrl);
        await firstValueFrom(this.apiService.post('/register', {}));
        console.log(`Post hacia: ${baseUrl}/register`);
        // Ir a home
        console.log('navegando...');
        this.router.navigate(['/login']).then(res => {
          console.log('resultado navegación:', res);
        });
      } catch (error) {
        console.error("Error en register:", error);
      }
    }
  }
}