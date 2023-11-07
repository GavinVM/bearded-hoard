import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { AddEntriesComponent } from './add-entries/add-entries.components';
import { EditEntriesComponent } from './edit-entries/edit-entries.component';
import { ViewEntriesComponent } from './view-entries/view-entries.component';
import { AgGridModule } from 'ag-grid-angular';
import { AppDataService } from './services/appData.service';

@NgModule({
  declarations: [
    AppComponent,
    AddEntriesComponent,
    EditEntriesComponent,
    ViewEntriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgGridModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatRadioModule,
  ],
  providers: [AppDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
