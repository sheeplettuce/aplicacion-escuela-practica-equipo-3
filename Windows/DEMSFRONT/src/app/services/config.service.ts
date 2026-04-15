import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  get apiUrl(): string {
    const config = (window as any).APP_CONFIG;

    if (!config || !config.API_URL) {
      throw new Error('APP_CONFIG no está definido. ¿Olvidaste cargar config.js en index.html?');
    }

    return config.API_URL;
  }
}