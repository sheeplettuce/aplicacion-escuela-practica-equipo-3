import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface Reservacion {
  idReservacion?: number;
  NombreCliente:  string;
  Telefono:       string;
  Correo:         string;
  Fecha:          string;
  NoPersonas:     number;
  Estado?:        string;
  idTrabajador?:  number;
}

@Injectable({ providedIn: 'root' })
export class ReservacionesService {
  private api = ``; // ← ajusta tu puerto

  constructor(private http: HttpClient, private config: ConfigService) {
    this.api = `${this.config.apiUrl}/Reservaciones`;
  }

  getAll(): Observable<Reservacion[]> {
    return this.http.get<Reservacion[]>(this.api);
  }

  getProximas(): Observable<Reservacion[]> {
    return this.http.get<Reservacion[]>(`${this.api}/proximas`);
  }

  create(data: Reservacion): Observable<any> {
    return this.http.post(this.api, data);
  }

  update(id: number, data: Reservacion): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}