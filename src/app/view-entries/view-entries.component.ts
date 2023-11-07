import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AppDataService } from '../services/appData.service';

@Component({
  selector: 'app-view-entries',
  templateUrl: './view-entries.component.html',
  styleUrls: ['./view-entries.component.css'],
})
export class ViewEntriesComponent {
  rowData;
  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: 'title' },
    { field: 'type' },
    { field: 'certificate' },
  ];

  

  constructor(private appDataService: AppDataService) {
    this.rowData = this.appDataService.getEntries();
  }
  
  public onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
  }

  public switchView(viewType: string): void {
    console.log(viewType)
  }

  
}
