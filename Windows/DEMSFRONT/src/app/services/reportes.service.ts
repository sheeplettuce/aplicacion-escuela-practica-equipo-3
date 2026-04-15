import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ResumenReporte {
  totalVentas: number;
  cantidadVentas: number;
  ticketPromedio: number;
  metodoPrincipal: string;
  porcentajeMetodo: number;
  historialVentas: VentaItem[];
  topPlatillos: PlatilloItem[];
}

export interface VentaItem {
  idPedido: number;
  Fecha: string;
  total: number;
  metodo: string;
  mesero: string;
}

export interface PlatilloItem {
  platillo: string;
  cantidadVendida: number;
}

export interface CambioItem {
  idHistorial: number;
  TablaAfectada: string;
  Accion: string;
  DatosAnt: string;
  DatosNv: string;
  Fecha: string;
  Descripcion: string;
  trabajador: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = ``;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = `${this.config.apiUrl}/reportes`;
  }

  getResumen(desde: string, hasta: string): Observable<ResumenReporte> {
    return this.http.get<ResumenReporte>(`${this.apiUrl}/resumen?desde=${desde}&hasta=${hasta}`);
  }

  getHistorialCambios(): Observable<CambioItem[]> {
    return this.http.get<CambioItem[]>(`${this.apiUrl}/historial-cambios`);
  }
}