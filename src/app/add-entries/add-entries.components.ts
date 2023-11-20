import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppDataService } from '../services/appData.service';
import { IEntry } from '../model/entry.model'
import { ISearchOptions } from '../model/searchOptions.model';
 
@Component({
  selector: 'app-add-entries',
  templateUrl: './add-entries.component.html',
  styleUrls: ['./add-entries.component.css']
})
export class AddEntriesComponent implements OnInit {

  searchField!: FormControl;
  newEnrtry!: IEntry;
  results!: any;
  options!: ISearchOptions[];

  constructor(private appDataService: AppDataService){
    this.searchField = new FormControl('');

    this.newEnrtry = {
      title: '',
      overview: '',
      image: '',
      apiGenreIds: [],
      apiId: 0,
      kind: ''
    }
    console.info(`AddEntriesComponent.constructor:: Starting`)
    // this.appDataService.getSearchResults('new moon').subscribe({
    //   next: (data) => {
    //     console.debug(data)
    //     this.results = data
    //   },
    //   error: (error) => {
    //       console.error('oops');
    //       console.error(error)
    //   }
    // });
    console.info(`AddEntriesComponent.constructor:: service called`)
    console.debug(this.results)
  }

  ngOnInit(){
    this.searchField.valueChanges.subscribe((val:string) => {
      if(val.length > 3){
        this.appDataService.getSearchResults(val).subscribe({
          next: (data:any) => {
            console.debug(data)
            this.results = data.results;
            this.options = data.results.map((result:any) => {
              return {
                title: result.title,
                id: result.id
              }
            });
          },
          error: (error) => {
              console.error('oops');
              console.error(error)
              this.options = [];
          }
        });
      } else if(val == ''){
        this.options = [];
      }
    });
  }


}