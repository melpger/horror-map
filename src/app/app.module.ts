import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { Events } from './services/events';
import { InterceptorService } from './services/interceptor.service';
import { LoadingService } from './services/loading.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { TokenService } from './services/token.service';
import { UserAPIService } from './services/user-api.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    IonicStorageModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    LoginService,
    LoadingService,
    TokenService,
    ConfigService,
    UserAPIService,
    LogoutService,
    Events
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
