import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController
  ) { }

  /**
   * Checks if the user is already logged in or not.
   *
   * @returns true: if logged/false: not logged in.
   */
  public isAuthenticated(): any {
    this.storage.get('token').then((key) => {
      if ('' !== key && null != key) {
        return true;
      } else {
        return false;
      }
    });
  }

  public processLogin() {

  }

  public showError(err?: any) {
    console.log('showError', err);
    if (err.name === 'HttpErrorResponse') {
      if (err.status === 400 || err.status === 401) {
          const name = 'Login Failed';
          const msg = 'Incorrect email or password';
          const btnOk = 'Ok';

          this.presentAlert(name, msg, btnOk);
        } else {
            // do nothing.
        }
    } else {
      const name = 'Login Failed';
      const msg = 'Incorrect email or password';
      const btnOk = 'Ok';

      this.presentAlert(name, msg, btnOk);
    }
  }

  async presentAlert(header: string, message: string, button: string) {
    const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [button]
    });

    alert.present();
}

}
