import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { SectionIntroComponent } from '../../components/section-intro/section-intro.component';
import { ReservationRowComponent } from '../../components/reservation-row/reservation-row.component';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';

interface Reservation {
  idReservation: number;
  NombreCliente: string;
  Telefono: string;
  Fecha: string;
  NoPersonas: number;
  Estado: string;
}

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    SectionIntroComponent,
    ReservationRowComponent,
  ],
})
export class ReservacionesPage implements OnInit {
  constructor(private apiService: ApiService) { }

  reservations: Reservation[] = [];

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadReservations();
  }

  async loadReservations() {
    try {
      const response = await firstValueFrom(this.apiService.get('/Reservaciones/proximas')) as Reservation[];
      this.reservations = response;
      console.log('Reservaciones cargadas:', JSON.stringify(this.reservations));
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
    }
  }

  getMes(fecha: string): string {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[new Date(fecha).getMonth()];
  }

  getDia(fecha: string): string {
    return new Date(fecha).getDate().toString().padStart(2, '0');
  }
}
