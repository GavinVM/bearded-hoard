import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageExampleComponent } from './landing-page-example.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageExampleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageExampleRoutingModule {}
