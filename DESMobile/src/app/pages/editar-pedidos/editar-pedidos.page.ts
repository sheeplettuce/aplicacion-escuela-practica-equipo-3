import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { PageBodyComponent } from '../../layout/page-body/page-body.component';
import { PageHeaderCreamComponent } from '../../layout/page-header-cream/page-header-cream.component';
import { BottomNavComponent } from '../../layout/bottom-nav/bottom-nav.component';
import { DividerLineComponent } from '../../components/divider-line/divider-line.component';
import { PedidoSelectRowComponent } from 'src/app/components/pedido-select-row/pedido-select-row.component';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { PedidoE } from 'src/app/models/PedidoE.model';

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
  selector: 'app-editar-pedidos',
  templateUrl: './editar-pedidos.page.html',
  styleUrls: ['./editar-pedidos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    PageBodyComponent,
    PageHeaderCreamComponent,
    BottomNavComponent,
    DividerLineComponent,
    PedidoSelectRowComponent,
    CommonModule
  ],
})
export class EditarPedidosPage implements OnInit {
  pedidos: Pedido[] = [];
  pedidosE: PedidoE[] = [];
  mesas: { [mesa: string]: PedidoE[] } = {};
  mostrador: PedidoE[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.cargarPedidos();
  }

  async cargarPedidos() {
    try {
      const pedidosRaw = await firstValueFrom(this.api.get('/Pedidos/')) as Pedido[];
      // Filtrar solo pendientes
      const pendientes = pedidosRaw.filter(
        p =>
          p.Estado.toLowerCase() === 'proceso' ||
          p.Estado.toLowerCase() === 'pending'
      );

      // Ordenar por NoMesa y Fecha
      pendientes.sort((a, b) => {
        const mesaA = a.NoMesa || 0;
        const mesaB = b.NoMesa || 0;
        if (mesaA !== mesaB) return mesaA - mesaB;
        return new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime();
      });

      // Mapear a PedidoE
      this.pedidosE = pendientes.map(p => ({
        idPedido: p.idPedido,
        folio: p.idPedido.toString(),
        mesa: p.NoMesa?.toString(),
        items: p.Platillos || [],
        estado: p.Estado,
        tipo: p.Tipo,
        TrabajadorId: p.Mesero?.id || 0,
      }));

      // Separar mesas y mostrador
      this.mesas = {};
      this.mostrador = [];

      this.pedidosE.forEach(p => {
        if (p.tipo === 0) {
          if (!this.mesas[p.mesa || '']) this.mesas[p.mesa || ''] = [];
          this.mesas[p.mesa || ''].push(p);
        } else {
          this.mostrador.push(p);
        }
      });
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  }

  editarPedido(pedido: PedidoE) {
    this.router.navigate(['/agr-ed-pedido'], { state: { pedido } });
  }
}