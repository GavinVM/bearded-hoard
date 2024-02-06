import { Component, Input, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { AppDataService } from '../services/appData.service';
import { Entry } from '../model/entry.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-entries',
  templateUrl: './view-entries.component.html',
  styleUrls: ['./view-entries.component.css'],
})
export class ViewEntriesComponent {
  rowData!: any;
  gridApi!: GridApi;
  details!: Entry;
  isDetailsVisable!: boolean
  currentSelectedRow!: any;

  columnDefs: ColDef[] = [
    { field: 'title' },
    { field: 'type' },
    { field: 'overview', valueFormatter: param => this.describeFormat(param?.value)  }
  ];

  constructor(private appDataService: AppDataService) {
    this.appDataService.getEntries().subscribe((response: HttpResponse<any>) => {
      if(response.status != 200){
        console.error(`Response status is ${response.status}, due to ${response.statusText}`);
      } else {
        this.rowData = JSON.parse(response.body);
      }
    });

    this.isDetailsVisable = false;
  }

  viewDetails(event:any){
    this.isDetailsVisable = true;
    this.details = event.api.getSelectedRows()[0];
    this.currentSelectedRow = event.api;
  }

  closeDetails(){
    this.isDetailsVisable = false;
    this.details = {
      apiId: 0,
      genres: [],
      image: '',
      kind: '',
      overview: '',
      title: ''
    }
  }

  public onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  public switchView(viewType: string): void {
    console.log(viewType);
  }

  describeFormat(description:string){
    return description.length > 50? `${description.substring(0,(description.indexOf(' ', 50)))}...` : description
  }

  typeLogo(type:string){
    if(type === 'bluray'){
      return `assets\\logos\\bluray.svg`
    } else {
      return `assets\\logos\\4k.svg`
    }
  }
}
