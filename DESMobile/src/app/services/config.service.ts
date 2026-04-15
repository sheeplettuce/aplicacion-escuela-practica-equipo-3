import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const API_KEY = 'api_url';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  async setApiUrl(url: string) {
    await Preferences.set({
      key: API_KEY,
      value: url
    });
  }

  async getApiUrl(): Promise<string | null> {
    const { value } = await Preferences.get({ key: API_KEY });
    return value;
  }

  async isConfigured(): Promise<boolean> {
    const url = await this.getApiUrl();
    return !!url;
  }
}