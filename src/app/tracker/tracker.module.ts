import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackerPage } from './tracker.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TrackerPageRoutingModule } from './tracker-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TrackerPageRoutingModule
  ],
  declarations: [TrackerPage]
})
export class TrackerPageModule {}
