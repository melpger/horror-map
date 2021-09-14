import { Injectable } from '@angular/core';
import { SERVER_URL } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Constants {
  public static dialogOK = 'OK';
  public static errorNW = 'Cannot connect to the network. Please try again later.';
}

export const TIMEOUT_MILLISECONDS = 30000;
export const NEW_USER_API_ENDPOINT = SERVER_URL + '/user';

export enum ScreenID {
  pageHome = 1,
  pageLogin,
  pageAll,
  pageLoginTab,
  pageTabs,
  pageDiscoverTab,
  pageMapTab,
  pageProfileTab
}

