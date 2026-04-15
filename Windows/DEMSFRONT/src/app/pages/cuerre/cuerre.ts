import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { ConfigService } from '../../services/config.service';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';

@Component({
  selector: 'app-cuerre',
  imports: [QRCodeComponent, HeaderComponent],
  templateUrl: './cuerre.html',
  styleUrl: './cuerre.css',
})
export class Cuerre {
  public qrData: string = '';
  constructor(private config: ConfigService){
    this.qrData = `${this.config.apiUrl}`;
  }
}
