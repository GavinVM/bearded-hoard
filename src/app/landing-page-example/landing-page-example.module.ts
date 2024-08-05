import { IonicModule } from '@ionic/angular';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingPageExampleComponent } from './landing-page-example.component';

import { LandingPageExampleRoutingModule } from './landing-page-example-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LandingPageExampleRoutingModule
  ],
  declarations: [LandingPageExampleComponent]
})
export class LandingPageExampleModule {}
