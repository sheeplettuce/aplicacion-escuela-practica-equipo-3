import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * Servicio principal para consumir la API remota.
   * El endpoint se construye dinámicamente usando la URL base de ConfigService.
   */
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  /**
   * Realiza una solicitud POST a la API.
   * @param endpoint Ruta relativa del backend.
   * @param body Payload que se enviará en el cuerpo.
   */
  post(endpoint: string, body: any) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando POST a:', `${baseUrl}${endpoint}`, 'con body:', JSON.stringify(body));
        return this.http.post(`${baseUrl}${endpoint}`, body, {
          observe: 'response'
        });
      })
    );
  }

  get(endpoint: string) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando GET a:', `${baseUrl}${endpoint}`);
        return this.http.get(`${baseUrl}${endpoint}`);
      })
    );
  }

  put(endpoint: string, body: any) {
    return from(this.config.getApiUrl()).pipe(
      switchMap(baseUrl => {
        console.log('Realizando PUT a:', `${baseUrl}${endpoint}`, 'con body:', body);
        return this.http.put(`${baseUrl}${endpoint}`, body, {
          observe: 'response'
        });
      })
    );
  }

  /**
   * Crea un stream SSE que escucha eventos en tiempo real de pedidos.
   * Reconecta automáticamente en caso de error.
   */
  escucharEventos(): Observable<any> {
    return new Observable(observer => {

      let evtSource: EventSource | null = null;

      const connect = async () => {
        const baseUrl = await this.config.getApiUrl();

        console.log('Conectando a SSE...');

        evtSource = new EventSource(`${baseUrl}/sse/events`);

        evtSource.addEventListener('pedido_ready', (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          observer.next({
            tipo: 'pedido_ready',
            ...data
          });
        });

        evtSource.onerror = (err) => {
          console.error('SSE error, reconectando...', err);

          evtSource?.close();

          setTimeout(() => {
            connect();
          }, 3000);
        };
      };

      connect();

      return () => {
        console.log('Cerrando SSE');
        evtSource?.close();
      };
    });
  }
}