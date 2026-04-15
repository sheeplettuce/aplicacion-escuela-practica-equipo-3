import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ConfigService } from '../../services/config.service';

export interface Pedido {
  id: number;
  mesa: number;
  numero: string;
  estado: 'Pendiente' | 'Listo' | 'Cancelado' | 'Actualizado';
  items: {
    cantidad: number;
    nombre: string;
    nota?: string;
  }[];
  hora: string;
  total: number;
}

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cocina.html',
  styleUrls: ['./cocina.css'],
})

export class CocinaComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';
  pedidos: Pedido[] = [];

  private sseUrl = ``;
  private apiUrl = ``;
  private eventSource?: EventSource;

  constructor(private cdr: ChangeDetectorRef, private config: ConfigService) {
    this.sseUrl = `${this.config.apiUrl}/sse/events`;
    this.apiUrl = `${this.config.apiUrl}/Pedidos`;
  } // para forzar detección de cambios

  ngOnInit(): void {
    this.cargarPedidos();
    this.conectarSSE();
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }

  formatearNumero(id: number): string {
    return id.toString().padStart(3, '0');
  }

  formatearHora(fecha: any): string {
    const f = fecha ? new Date(fecha) : new Date();

    return f.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  transformarPedido(data: any): Pedido {

    const platillos = data.Platillos || [];

    const total = platillos.reduce((acc: number, d: any) => {
      return acc + ((d.PrecioUnitario || 0) * (d.Cantidad || 1));
    }, 0);

    return {
      id: Number(data.idPedido),
      mesa: data.NoMesa ?? 0,
      numero: this.formatearNumero(data.idPedido),
      estado: 'Pendiente',
      items: platillos.map((p: any) => ({
        cantidad: p.Cantidad,
        nombre: p.nombre || 'Platillo',
        nota: p.Nota
      })),
      hora: this.formatearHora(data.Fecha),
      total
    };
  }

  cargarPedidos(): void {
    this.isLoading = true;
    fetch(this.apiUrl)
      .then(r => r.json())
      .then(data => {
        console.log('Pedidos recibidos desde backend:', data);

        this.pedidos = data
          .filter((p: any) => p.Estado === 'Proceso') // solo los activos
          .map((p: any) => {

            const items = p.Platillos || [];
            console.log(`Pedido ${p.idPedido} - items:`, items);
            const total = items.reduce((acc: number, item: any) => {
              return acc + ((item.PrecioUnitario || 0) * (item.Cantidad || 1));
            }, 0);

            return {
              id: p.idPedido,
              mesa: p.NoMesa ?? 0,
              numero: this.formatearNumero(p.idPedido),
              estado: 'Pendiente' as const,
              items: items.map((i: any) => ({
                cantidad: i.Cantidad,
                nombre: i.nombre,
                nota: i.Nota
              })),
              hora: this.formatearHora(p.Fecha),
              total
            };
          });

        this.isLoading = false;
        this.cdr.detectChanges(); // fuerza el render
      })
      .catch(e => {
        this.errorMessage = 'Error al cargar pedidos.';
        this.isLoading = false;
        console.error(e);
      });
  }

  conectarSSE(): void {
    this.eventSource = new EventSource(this.sseUrl);

    this.eventSource.addEventListener('nuevo_pedido', (e: MessageEvent) => {
      const pedido: Pedido = JSON.parse(e.data);
      console.log('Nuevo pedido SSE:', JSON.stringify(pedido));
      const nuevoPedido = this.transformarPedido(pedido);
      this.pedidos.unshift(nuevoPedido);
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.addEventListener('pedido_actualizado', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      console.log('Pedido actualizado SSE:', JSON.stringify(data));
      const pedidoActualizado = this.transformarPedido({
        idPedido: Number(data.id),
        NoMesa: data.NoMesa,
        Fecha: new Date().toISOString(),
        Platillos: data.Platillos
      });

      this.pedidos = this.pedidos.map(p =>
        p.id === Number(data.id)
          ? { ...pedidoActualizado, estado: 'Actualizado' }
          : p
      );
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.addEventListener('pedido_cancelado', (e: MessageEvent) => {
      const { id } = JSON.parse(e.data);
      console.log(`Pedido cancelado SSE: ${id}`);
      this.pedidos = this.pedidos.map(p =>
        p.id === Number(id) ? { ...p, estado: 'Cancelado' } : p
      );
      this.cdr.detectChanges(); // 👈
    });

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, reconectando en 3s...');
      this.eventSource?.close();
      setTimeout(() => this.conectarSSE(), 3000);
    };
  }

  marcarLista(pedido: Pedido): void {
    fetch(`${this.apiUrl}/${pedido.id}/ready`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
        this.cdr.detectChanges();
      })
      .catch(e => console.error('Error al marcar como listo:', e));
  }

}