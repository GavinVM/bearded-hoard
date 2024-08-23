import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CexIntergrationComponent } from './cex-intergration.component';

const routes: Routes = [
  {
    path: '',
    component: CexIntergrationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CexIntergrationRoutingModule {}
