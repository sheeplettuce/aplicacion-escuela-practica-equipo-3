import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

export interface Trabajador {
  idTrabajador: number;
  Nombre: string;
  Rol: string;
  RolTrabajadores_idRolTrabajadores?: number;
}

export interface LoginResponse {
  message: string;
  token: string;        // tokensito agregado
  trabajador: Trabajador;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Estado actual del trabajador autenticado.
   */
  private currentUserSubject = new BehaviorSubject<Trabajador | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private config: ConfigService) {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(usuario: string, contraseña: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.config.apiUrl}/Trabajadores/login`, {
        Nombre: usuario,
        Contra: contraseña,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.trabajador));
          localStorage.setItem('token', response.token); // 👈 guarda el token
          this.currentUserSubject.next(response.trabajador);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // 👈 para el interceptor, pero no lo usas bue XD
  }

  getCurrentUser(): Trabajador | null {
    return this.currentUserSubject.value;
  }

  getRol(): string | null {
    const user = this.currentUserSubject.value;
    console.log('Usuario actual:', user);
    return user ? user.Rol : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); // 👈 limpia el token
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}