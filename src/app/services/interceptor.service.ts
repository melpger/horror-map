import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { Constants } from '../constants/constants';
import { Events } from './events';
import { LoadingService } from './loading.service';
import { TokenService } from './token.service';

export const INVALID_TOKEN_START = 2000;
export const INVALID_TOKEN_END = 2999;
export const TOKEN_INVALID_CODE = 10001;
export const USER_NOT_FOUND = 10002;

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{
  alertshown = false;

  constructor(
    private storage: Storage,
    private tokenSrvc: TokenService,
    private loadSrvc: LoadingService,
    private events: Events,
    private alert: AlertController
  ) {
    console.log('intercepting constructor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercepting');

    const clonedRequest = this.addHeader(request);
    if (this.tokenSrvc.getToken() == null || this.tokenSrvc.getToken() === '' || this.tokenSrvc.getToken() === undefined) {
      console.log('getToken is null empty or undefined');
      return this.getTokenFromStorage(clonedRequest, next);
    } else {
      console.log('getToken is not null empty or undefined');
      return this.getTokenFromService(clonedRequest, next);
    }
  }

  private addHeader(request: HttpRequest<any>) {
    console.log('adding token to http');

    let clone: HttpRequest<any>;
    // eslint-disable-next-line prefer-const
    clone = request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: `application/json`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': `application/json`,
      }
    });
    return clone;
  }

  private getTokenFromStorage(request: HttpRequest<any>, next: HttpHandler) {
    console.log('getTokenFromStorage');
    const promise = this.storage.get('token');
    return from(promise).pipe(mergeMap(token => this.processToken(request, token, next)));
  }

  private getTokenFromService(request: HttpRequest<any>, next: HttpHandler) {
    console.log('getTokenFromService');
    const token = this.tokenSrvc.getToken();
    return this.processToken(request, token, next);
  }

  private processToken(request: HttpRequest<any>, token: any, next: HttpHandler) {
    const clonedReq = this.addToken(request, token);
    console.log(clonedReq);

    return next.handle(clonedReq).pipe(tap( (result: any) => {
      console.log(result);
      if (result.body && result.body.results) {

        if (result.body.results.access_token) {
          console.log(result.body.results.access_token);
          this.tokenSrvc.setToken(result.body.results.access_token);

          const newtoken = result.body.results.access_token;
          this.storeToken(newtoken).then((val: any) => {
            console.log(val);
          });
        } else {
          // do nothing.
        }

        if (false === result.body.results.success) {
          if (result.body.results.error && this.isTokenInvalid(result.body.results.error.code)) {
            console.log('publishing error');
            this.events.publish('http:forbidden', result.body);
          } else {
            return throwError(result);
          }
        } else {
          // do nothing.
          return result;
        }
      } else {
        return throwError(result);
      }
    }), catchError(error => {
      // Perhaps display an error for specific status codes here already?
      console.log('interceptor error:', error);
      this.loadSrvc.dismiss();
      if (error.name === 'HttpErrorResponse') {
        if (error.status === 400 || error.status === 401) {
          try {
            if (error.error.error.name === 'TokenExpiredError'
            || error.error.error.name === 'JsonWebTokenError'
            || error.error.error.name === 'NotBeforeError') {
              error.name = error.error.error.name;
              return throwError(error);
            } else {
              return throwError(error);
            }
          } catch {
            return throwError(error);
          }
        } else if (error.status === 0) {
          error.header = '';
          error.message = Constants.errorNW;
          this.showAlert(error);
        } else {
          console.log(error);
          error.header = error.status;
          error.message = error.statusText;
          this.showAlert(error);
        }
      }
      // Pass the error to the caller of the function
      return throwError(error);
    }));
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async showAlert(err: any) {
    console.log(err);

    const dialogButtonOk = Constants.dialogOK;

    const alert = await this.alert.create({
      header: err.header,
      message: err.message,
      buttons: [dialogButtonOk]
    });
    if (!this.alertshown) {
      this.alertshown = true;
      alert.present();
    }

    alert.onDidDismiss().then(() => {
      this.alertshown = false;
    });
  }

  private addToken(request: HttpRequest<any>, token: any) {
    console.log('adding token to http', token);

    if (token) {
      let clone: HttpRequest<any>;
      console.log('authorization:', token);
      // eslint-disable-next-line prefer-const
      clone = request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `${token}`
        }
      });
      return clone;
    }

    return request;
  }

  private isTokenInvalid(code: any) {
    let isTokenInvalid = false;

    if (code >= INVALID_TOKEN_START && code <= INVALID_TOKEN_END ) {
      return true;
    }

    const OTHER_INVALID_TOKEN = [
      TOKEN_INVALID_CODE,
      USER_NOT_FOUND
    ];

    OTHER_INVALID_TOKEN.forEach(element => {
      if (element === code) {
        console.log('invalid token found', element);
        isTokenInvalid = true;
      }
    });
    return isTokenInvalid;
  }

  private storeToken(accessToken: string): Promise<any> {
    console.log('tapped interceptor save token ' + accessToken);
    return this.storage.set('token', accessToken);
  }
}
