import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;
  private token = '';

  constructor() { }

  getConfig() {
    return this.config;
  }

  saveConfig(config: any) {
    this.config = config;
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
      return this.token;
  }

  getAPIBody() {
    const apiBody = {
        hashKey: this.getConfig().hashKey,
        deviceID: this.getConfig().uuid,
    };
    return apiBody;
  }

  getBody(body?: any) {
      if (body === undefined) {
          body = {};
      }
      const apiBody: any = this.getAPIBody();
      for (const key in apiBody) {
        if (Object.prototype.hasOwnProperty.call(apiBody, key)) {
          body[key] = apiBody[key];
        }
      }
      return body;
  }
}
