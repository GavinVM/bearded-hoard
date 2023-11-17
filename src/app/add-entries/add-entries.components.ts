import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppDataService } from '../services/appData.service';
import { IEntry } from '../model/entry.model'
 
@Component({
  selector: 'app-add-entries',
  templateUrl: './add-entries.component.html',
  styleUrls: ['./add-entries.component.css']
})
export class AddEntriesComponent {

  searchField!: FormControl;
  newEnrtry!: IEntry;
  results!: any;
AppDataService
  constructor(private appDataService: AppDataService){
    this.searchField = new FormControl('');

    this.newEnrtry = {
      title: '',
      overview: '',
      image: ''
      apiGenreIds: [],
      apiId: 0,
      kind: ''
    }
    this.results = this.appDataService.getSearchResults('new moon');
    console.debug(this.results)
  }


}