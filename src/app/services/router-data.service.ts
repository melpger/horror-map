/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ScreenID } from '../constants/constants';
import { ActivatedRoute, Router, UrlTree, PRIMARY_OUTLET, UrlSegment, UrlSegmentGroup } from '@angular/router';

interface RouteData {
  id: number;
  data: JSON;
}

export const screenMapping = [
  { id: ScreenID.pageHome, path: 'home', root: true, subRoot: false, parent: 0 },
  { id: ScreenID.pageLogin, path: 'login', root: true, subRoot: false, parent: 0 },
  { id: ScreenID.pageTabs, path: 'tabs', root: true, subRoot: false, parent: 0 },
  { id: ScreenID.pageDiscoverTab, path: 'discover', root: true, subRoot: false, parent: 0 },
  { id: ScreenID.pageMapTab, path: 'map', root: true, subRoot: false, parent: 0 },
  { id: ScreenID.pageProfileTab, path: 'profile', root: true, subRoot: false, parent: 0 },
];

@Injectable({
  providedIn: 'root'
})


export class RouterDataService {

  public routes: RouteData[] = [];

  constructor(
    private navCtrl: NavController,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private storage: Storage,
  ) { }

  setRoot(id: ScreenID, data?: any, options?: any) {
    if (undefined === data || null == data) {
      // do nothing.
    } else {
      const index = this.getDataIndex(id);

      if (index === -1) {
        this.routes.push({ id, data });
      } else {
        this.routes[index] = { id, data };
      }
    }

    if (undefined === options || null == options) {
      return this.navCtrl.navigateRoot('/' + this.getScreenURL(id));
    } else {
      return this.navCtrl.navigateRoot('/' + this.getScreenURL(id), options);
    }
  }

  push(id: ScreenID, data?: any, options?: any, sourcePage?: ScreenID) {
    console.log(id, data, options, sourcePage);

    this.setData(data, id);

    let rootpath = '/';
    const s: UrlSegment[] = this.getURLSegment();

    for (let x = 0; x < s.length; x++) {
      if (x + 1 === s.length && this.isPathRoot(s[x].path) && !this.isScreenIDSubRoot(id)) {
        // e.g. if from login then membership page . R + page = /page
        // rootpath = rootpath + "/";
        break;
      } else if (x + 1 === s.length && this.isPathRoot(s[x].path)) {  // R/page
        rootpath = rootpath + '/' + s[x].path;
      } else if (x + 1 <= s.length && this.isPathRoot(s[x].path) && this.isPathRoot(s[x + 1].path)) { // R/R/... - OK
        rootpath = rootpath + '/' + s[x].path;
      } else if (x + 1 <= s.length && this.isPathRoot(s[x].path) && this.isPathSubRoot(s[x + 1].path)
          && this.isScreenIDSubRoot(id)) { // R/R/tab1/page , R/R/tab2/page ... - OK
        rootpath = rootpath + '/' + this.getParentScreenURL(id);
        break;
      } else if (x + 1 <= s.length && this.isPathRoot(s[x].path)  && !this.isScreenIDSubRoot(id)
        && (this.getParentScreenID(id) === ScreenID.pageAll
        || this.getParentScreenID(id) === ScreenID.pageLoginTab)) { // e.g. tabs/tabs/tab1/concierge + inquiry
          rootpath = rootpath + '/' + s[x].path; // result => tabs/tabs/tab1/inquiry
          break;
      } else if (x + 1 <= s.length && this.isPathRoot(s[x].path)
          && this.isPathSubRoot(s[x + 1].path) && !this.isScreenIDSubRoot(id)
          && this.getParentScreenID(id) !== ScreenID.pageAll) { // e.g. tabs/tabs/tab1/concierge + calendar (from menu)
        console.log('R+SR+P');
        rootpath = rootpath + '/' + this.getParentScreenURL(id); // change tabs tabs/tabs/tab2/reservation
        break;
      } else if (x + 1 <= s.length && this.isPathRoot(s[x].path) && !this.isPathSubRoot(s[x + 1].path) && !this.isScreenIDSubRoot(id)) {
        rootpath = rootpath + '/' + this.getParentScreenURL(id);
      } else {
        break;
      }
    }

    console.log(rootpath);
    console.log(rootpath + '/' + this.getScreenURL(id));

    if (undefined === options || null == options) {
      return this.navCtrl.navigateForward(rootpath + '/' + this.getScreenURL(id));
    } else {
      return this.navCtrl.navigateForward(rootpath + '/' + this.getScreenURL(id), options);
    }
  }

  setData(data: any, id: ScreenID) {
    if (undefined === data || null == data) {
      // do nothing.
    } else {
      const index = this.getDataIndex(id);
      if (index === -1) {
        this.routes.push({ id, data });
      } else {
        this.routes[index] = { id, data };
      }
    }
  }

  getURLSegment() {
    const tree: UrlTree = this.route.parseUrl(this.route.url);
    const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = g.segments;

    return s;
  }

  popToRoot() {
    let rootpath = '/';
    const s: UrlSegment[] = this.getURLSegment();

    for (let x = 0; x < s.length; x++) {
      if (this.isPathRootorSubRoot(s[x].path)) {
        rootpath = rootpath + '/' + s[x].path;
      } else {
        break;
      }
    }

    return this.navCtrl.navigateRoot(rootpath);
  }

  isScreenIDRoot(id: ScreenID) {
    const x: any = screenMapping.find(route => route.id === id);
    if (undefined !== x) {
      return x.root;
    } else {
      return false;
    }
  }

  isScreenIDSubRoot(id: ScreenID) {
    const x: any = screenMapping.find(route => route.id === id);
    if (undefined !== x) {
      return x.sub_root;
    } else {
      return false;
    }
  }

  isPathRoot(path: string) {
    const x: any = screenMapping.find(route => route.path === path);
    if (undefined !== x) {
      return x.root;
    } else {
      return false;
    }
  }

  isPathRootorSubRoot(path: string) {
    const x: any = screenMapping.find(route => route.path === path);
    if (undefined !== x) {
      return x.root || x.sub_root;
    } else {
      return false;
    }
  }

  isPathSubRoot(path: string) {
    const x: any = screenMapping.find(route => route.path === path);
    if (undefined !== x) {
      return x.sub_root;
    } else {
      return false;
    }
  }


  pop(id: ScreenID, options?: any) {
    if (undefined === options || null == options) {
      return this.navCtrl.navigateBack('/' + this.getScreenURL(id));
    } else {
      return this.navCtrl.navigateBack('/' + this.getScreenURL(id), options);
    }
  }

  getDataIndex(id: ScreenID) {
    return this.routes.findIndex((route) => route.id === id);
  }

  getScreenURL(id: ScreenID) {
    const screenMappingIndex = screenMapping.findIndex((screen) => screen.id === id);
    return screenMapping[screenMappingIndex].path;
  }

  getParentScreenURL(id: ScreenID) {
    const screenMappingIndex = screenMapping.findIndex((screen) => screen.id === id);

    return this.getScreenURL(screenMapping[screenMappingIndex].parent);
  }

  getParentScreenID(childId: ScreenID) {
    const screenMappingIndex = screenMapping.findIndex((screen) => screen.id === childId);

    return screenMapping[screenMappingIndex].parent;
  }

  getScreenIDFromURL(path: string) {
    const screenMappingIndex = screenMapping.findIndex((screen) => screen.path === path);
    return screenMapping[screenMappingIndex].id;
  }

  getCurrentScreenID() {
    const s: UrlSegment[] = this.getURLSegment();
    return this.getScreenIDFromURL(s[s.length - 1].path);
  }

  isPathPageCommon(path: string) {
    const screenMappingIndex = screenMapping.findIndex((route) => route.path === path);
    if ( ScreenID.pageAll === screenMapping[screenMappingIndex].parent
      || ScreenID.pageLoginTab === screenMapping[screenMappingIndex].parent ) {
      return true;
    } else {
      return false;
    }
  }

  isPageCommon(id: ScreenID) {
    const screenMappingIndex = screenMapping.findIndex((screen) => screen.id === id);
    if ( ScreenID.pageAll === screenMapping[screenMappingIndex].parent
      || ScreenID.pageLoginTab === screenMapping[screenMappingIndex].parent ) {
      return true;
    } else {
      return false;
    }
  }

}
