/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ConfigService } from './services/config.service';
import { Events } from './services/events';
import { LogoutService } from './services/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private configService: ConfigService,
    private events: Events,
    private logoutSrvc: LogoutService
  ) {
    this.platform.ready().then(() => {
      //screen.orientation.lock('portrait-primary');
      this.configService.saveConfig({
        hashKey: 'sampleHashKey',
        deviceID: 'sampleUUID'
      });

      this.events.subscribe('http:forbidden', error => {
        console.log(error);
        this.logoutSrvc.goToLoginScreen();
      });

    });
  }

  async ngOnInit() {
    await this.storage.create();
  }
}
