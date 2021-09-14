import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return this.loadingController.create({
      // duration: 1000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return this.loadingController.dismiss().then(() => console.log('dismissed'));
    } else {
      // do nothing.
    }
  }
}
