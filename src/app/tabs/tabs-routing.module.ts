import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'add',
        loadChildren: () => import('../add/add.module').then(m => m.AddPageModule)
      },
      {
        path: 'tracker',
        loadChildren: () => import('../tracker/tracker.module').then(m => m.TrackerPageModule)
      },
      {
        path: 'cex',
        loadChildren: () => import('../cex-intergration/cex-intergration.module').then(m => m.CexIntergrationModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tracker',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tracker',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
