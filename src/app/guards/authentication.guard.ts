import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { LoginService } from '../services/login.service';
import { RouterDataService } from '../services/router-data.service';
import { ScreenID } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private storage: Storage,
    private loginService: LoginService,
    private routeData: RouterDataService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('judging where to go');
    return from(this.transitionToNextScreen().then((val) => {
      console.log('return judgement of place', val);
      return val;
    }));
  }

  transitionToNextScreen(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.storage.get('firstTime').then((key) => {
        if ('' !== key && null != key) {
          console.log('checking if loggedin or not');
          if (!this.loginService.isAuthenticated()) {
            console.log('Not logged in');
            this.routeData.setRoot(ScreenID.pageLogin);
            resolve(false);
          } else {
            console.log('Already logged in');
            this.routeData.setRoot(ScreenID.pageTabs);
            resolve(true);
          }
        } else {
          console.log('Opening for the first time');
          this.storage.set('firstTime', 'true');
          resolve(false);
        }
      });
    });
  }

}
