import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-seleccionar-platillo',
  standalone: true,
  templateUrl: './agr-prod.component.html',
  styleUrls: ['./agr-prod.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ],
})
export class SeleccionarPlatilloComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private api: ApiService) { }

  platillos: any[] = [];

  async ngOnInit() {
    await this.cargarPlatillos();
  }

  cargarPlatillos() {
  this.api.get('/Platillos/completo').subscribe({
    next: (data: any) => {
      console.log('Platillos obtenidos:', JSON.stringify(data));

      this.platillos = data.map((item: any) => ({
        id: item.idPlatillo,
        nombre: item.Nombre,
        tipo: item.Categoria?.nombre,
        precio: item.Precio,
        img: 'assets/pedidosAssets/platillo.png'
      }));

      console.log('Platillos parseados:', JSON.stringify(this.platillos));
    },
    error: (error) => {
      console.error('Error al cargar platillos:', error);
    }
  });
}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  seleccionar(item: any) {
    this.modalCtrl.dismiss(item);
  }
}