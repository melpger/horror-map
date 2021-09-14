import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { catchError, map, timeout } from 'rxjs/operators';
import { NEW_USER_API_ENDPOINT, TIMEOUT_MILLISECONDS } from '../constants/constants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserAPIService {

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) { }

  public issueToken(email: any, password: any): Observable<any> {
    const passwordHashed = Md5.hashStr(password);
    const body: any = {
      id: email,
      password: passwordHashed,
    };

    return this.httpClient.post(NEW_USER_API_ENDPOINT + '/login', this.configService.getBody(body)).pipe(
      timeout(TIMEOUT_MILLISECONDS),
      map((response: any) => {
          console.log('issue token response:', response);
          return response;
      }),
      catchError((err: any, caught: Observable<Response>) => {
          console.log(err, caught);
          return throwError(err);
      })
  );
  }
}
