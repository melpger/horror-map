import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const discoverTab = [
  { path: '', redirectTo: 'discover', pathMatch: 'full' },
  { path: 'discover', loadChildren: () => import('../discover/discover.module').then(m => m.DiscoverPageModule) },
];

const mapTab = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', loadChildren: () => import('../map/map.module').then(m => m.MapPageModule) },
];

const profileTab = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule) },
];

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: '', redirectTo: 'map_tab', pathMatch: 'full' },
      {
        path: 'discover_tab',
        children: discoverTab
      },
      {
        path: 'map_tab',
        children: mapTab
      },
      {
        path: 'profile_tab',
        children: profileTab
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
