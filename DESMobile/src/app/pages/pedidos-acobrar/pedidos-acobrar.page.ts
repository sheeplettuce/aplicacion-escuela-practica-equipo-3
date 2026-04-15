import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { PedidoCobroRowComponent } from '../../components/pedido-cobro-row/pedido-cobro-row.component';
import { PedidoE } from 'src/app/models/PedidoE.model';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface Pedido {
  idPedido: number;
  Fecha: string;
  Estado: string;
  NoMesa?: number;
  Tipo: number; // 0 = local, 1 = para llevar
  Mesero: { id: number; nombre: string };
  Platillos: any[];
}

@Component({
  selector: 'app-pedidos-acobrar',
  templateUrl: './pedidos-acobrar.page.html',
  styleUrls: ['./pedidos-acobrar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    PageHeaderCreamComponent,
    PageBodyComponent,
    BottomNavComponent,
    PedidoCobroRowComponent
  ]
})
export class PedidosACobrarPage implements OnInit {
  pedidosE: PedidoE[] = [];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.cargarPedidos();
  }

  async cargarPedidos() {
    try {
      const pedidosRaw = await firstValueFrom(this.api.get('/Pedidos/')) as Pedido[];
      const listos = pedidosRaw.filter(
        p =>
          p.Estado.toLowerCase() === 'listo' ||
          p.Estado.toLowerCase() === 'ready'
      );
      this.pedidosE = listos.map(p => ({
        idPedido: p.idPedido,
        folio: `P-${p.idPedido.toString().padStart(3, '0')}`,
        mesa: p.NoMesa ? `Mesa ${p.NoMesa}` : 'Para llevar',
        items: p.Platillos,
        estado: p.Estado,
        tipo: p.Tipo,
        TrabajadorId: p.Mesero.id
      }));
      console.log('Pedidos listos para cobrar:', JSON.stringify(this.pedidosE));
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  }

  getTotal(pedido: PedidoE): number {
    return pedido.items.reduce((total: number, item: any) => {
      return total + ((item.PrecioUnitario || 0) * (item.Cantidad || 1));
    }, 0);
  }

  cobrarPedido(pedido: PedidoE) {
    this.router.navigate(['/cobrar-pedido'], { state: { pedido } });
  }

}
