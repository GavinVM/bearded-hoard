import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEntriesComponent } from './add-entries/add-entries.components';
import { EditEntriesComponent } from './edit-entries/edit-entries.component';
import { ViewEntriesComponent } from './view-entries/view-entries.component';

const routes: Routes = [
  { path: 'add-entries', component: AddEntriesComponent },
  { path: 'edit-entries', component: EditEntriesComponent },
  { path: 'view-entries', component: ViewEntriesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
