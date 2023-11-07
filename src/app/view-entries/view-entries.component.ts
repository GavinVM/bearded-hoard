import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AppDataService } from '../services/appData.service';

@Component({
  selector: 'app-view-entries',
  templateUrl: './view-entries.component.html',
  styleUrls: ['./view-entries.component.css'],
})
export class ViewEntriesComponent {
  constructor(private appDataService: AppDataService) {}

  columnDefs: ColDef[] = [
    { field: 'title' },
    { field: 'type' },
    { field: 'certificate' },
  ];

  rowData = this.appDataService.getEntries();

  @ViewChild('MyGrid') grid!: AgGridAngular;
}
