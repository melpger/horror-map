import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ScreenID } from '../constants/constants';
import { LoadingService } from './loading.service';
import { RouterDataService } from './router-data.service';
import { TokenService } from './token.service';
import { UserAPIService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private routedata: RouterDataService,
    private storage: Storage,
    private tokenSrvc: TokenService,
    private loading: LoadingService,
    private userAPI: UserAPIService
  ) { }

  public hideTabs() {
    const tabBar = document.getElementById('tabBar');
    if (tabBar !== null && tabBar.style.display !== 'none') { tabBar.style.display = 'none'; }
  }

  public showTabs() {
      const tabBar = document.getElementById('tabBar');
      if (tabBar !== null && tabBar.style.display !== 'flex') { tabBar.style.display = 'flex'; }
  }

  goToLoginScreen() {
    this.performLogoutPreparation();
    this.routedata.setRoot(ScreenID.pageLogin);
  }

  performLogoutPreparation() {
    this.storage.set('token', '');
    this.storage.remove('user');
    this.storage.remove('id');
    this.tokenSrvc.removeToken();
    // this.userSrvc.removeUser();
    this.loading.dismiss();
  }

  checkIfTokenError(err: any) {
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
          return true;
      } else {
          return false;
      }
  }
}
