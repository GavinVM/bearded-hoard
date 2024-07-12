import { IonicModule } from '@ionic/angular';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CexIntergrationComponent } from './cex-intergration.component';

import { CexIntergrationRoutingModule } from './cex-intergration-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CexIntergrationRoutingModule
  ],
  declarations: [CexIntergrationComponent]
})
export class CexIntergrationModule {}
