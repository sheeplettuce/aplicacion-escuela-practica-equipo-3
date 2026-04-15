import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/headerAdmin/headerComponent';
import { ReportesService, ResumenReporte, CambioItem } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent implements OnInit {

  tabActiva: 'ventas' | 'historial' = 'ventas';
  filtroActivo: 'Todos' | 'Agregación' | 'Modificación' | 'Eliminación' = 'Todos';

  isLoading = false;
  errorMessage = '';

  desde = '2026-03-01';
  hasta = '2026-03-31';

  resumen: ResumenReporte = {
    totalVentas: 0,
    cantidadVentas: 0,
    ticketPromedio: 0,
    metodoPrincipal: 'N/A',
    porcentajeMetodo: 0,
    historialVentas: [],
    topPlatillos: []
  };

  historialCambios: CambioItem[] = [];

  constructor(
    private reportesService: ReportesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadResumen();
    this.loadHistorialCambios();
  }

  loadResumen() {
    this.isLoading = true;
    this.errorMessage = '';
    this.reportesService.getResumen(this.desde, this.hasta).subscribe({
      next: (data) => {
        this.resumen = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando resumen:', err);
        this.errorMessage = 'No se pudo cargar el reporte.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistorialCambios() {
    this.reportesService.getHistorialCambios().subscribe({
      next: (data) => {
        this.historialCambios = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando historial:', err)
    });
  }

  get topPlatillosConPorcentaje() {
    const max = this.resumen.topPlatillos[0]?.cantidadVendida || 1;
    return this.resumen.topPlatillos.map((p, i) => ({
      posicion: i + 1,
      nombre: p.platillo,
      cantidad: p.cantidadVendida,
      porcentaje: Math.round((p.cantidadVendida / max) * 100)
    }));
  }

  get historialAgrupado() {
    const grupos: { [key: string]: CambioItem[] } = {};
    this.historialCambios.forEach(item => {
      const fecha = new Date(item.Fecha);
      const hoy = new Date();
      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);

      let periodo = fecha.toLocaleDateString('es-MX');
      if (fecha.toDateString() === hoy.toDateString()) periodo = 'Hoy';
      else if (fecha.toDateString() === ayer.toDateString()) periodo = 'Ayer';

      if (!grupos[periodo]) grupos[periodo] = [];
      grupos[periodo].push(item);
    });

    return Object.keys(grupos).map(periodo => ({
      periodo,
      items: grupos[periodo].filter(i =>
        this.filtroActivo === 'Todos' || this.getTipoLabel(i.Accion) === this.filtroActivo
      )
    })).filter(g => g.items.length > 0);
  }

  getTipoLabel(accion: string): string {
    const map: { [key: string]: string } = {
      'INSERT': 'Agregación',
      'UPDATE': 'Modificación',
      'DELETE': 'Eliminación'
    };
    return map[accion] || accion;
  }

  getTipoClass(accion: string): string {
    const map: { [key: string]: string } = {
      'INSERT': 'badge-agregacion',
      'UPDATE': 'badge-modificacion',
      'DELETE': 'badge-eliminacion'
    };
    return map[accion] || '';
  }

  getDescripcionCambio(item: CambioItem): string {
    const accion = this.getTipoLabel(item.Accion);
    if (accion === 'Agregación') return `Se agregó "${item.DatosNv}" en ${item.TablaAfectada}`;
    if (accion === 'Modificación') return `Se modificó "${item.DatosAnt}" → "${item.DatosNv}" en ${item.TablaAfectada}`;
    if (accion === 'Eliminación') return `Se eliminó "${item.DatosAnt}" de ${item.TablaAfectada}`;
    return item.Descripcion || '';
  }

  aplicarFiltro() {
    this.loadResumen();
  }

  cambiarTab(tab: 'ventas' | 'historial') {
    this.tabActiva = tab;
  }

  cambiarFiltro(filtro: 'Todos' | 'Agregación' | 'Modificación' | 'Eliminación') {
    this.filtroActivo = filtro;
  }
}