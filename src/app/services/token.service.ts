import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token = '';

  constructor(
  ) {

  }

  setToken(token: string) {
      this.token = token;
  }

  removeToken() {
      this.token = '';
  }

  getToken(): string {
      return this.token;
  }

  decodeAccessToken() {
      const result: any = jwt_decode(this.getToken());
      return result.access_token;
  }
}
