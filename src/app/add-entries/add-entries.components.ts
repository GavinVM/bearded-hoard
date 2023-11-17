import { Component } from '@angular/core';
import { AppDataService } from '../services/appData.service';
 
@Component({
  selector: 'app-add-entries',
  templateUrl: './add-entries.component.html',
  styleUrls: ['./add-entries.component.css']
})
export class AddEntriesComponent {

  searchField!: FormControl;
  newEnrtry!: IEntry;
  results!: any;
  
  constructor(private appDataService: appDataService){
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