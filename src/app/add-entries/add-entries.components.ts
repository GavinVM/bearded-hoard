import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppDataService } from '../services/appData.service';
import { IEntry } from '../model/entry.model';
import { ISearchOptions } from '../model/searchOptions.model';

@Component({
  selector: 'app-add-entries',
  templateUrl: './add-entries.component.html',
  styleUrls: ['./add-entries.component.css'],
})
export class AddEntriesComponent implements OnInit {
  searchField!: FormControl;
  newEnrtry!: IEntry;
  results!: any;
  options!: ISearchOptions[];

  constructor(private appDataService: AppDataService) {
    this.searchField = new FormControl('');

    this.newEnrtry = {
      title: '',
      overview: '',
      image: '',
      apiGenreIds: [],
      apiId: 0,
      kind: '',
    };
  }

  ngOnInit() {
    this.searchField.valueChanges.subscribe((val: string) => {
      if (val.length > 3) {
        this.appDataService.getSearchResults(val).subscribe({
          next: (data: any) => {
            console.debug(data);
            this.results = data.results;
            this.options = data.results.map((result: any) => {
              return {
                title: result.title,
                id: result.id,
              };
            });
          },
          error: (error) => {
            console.error('oops');
            console.error(error);
            this.options = [];
          },
        });
      } else if (val == '') {
        this.options = [];
      }
    });
  }

  selectedOptions(value: any) {
    console.info(`current claue ${value}`);
    let id = this.options.map((option: ISearchOptions) => {
      if (option.title === value) {
        return option.id;
      } else {
        return null;
      }
    });
    console.info(`current options ${this.options}`);
    console.info(`current claue ${id}`);
    let tempResult: any;
    if (id)
      tempResult = this.results.map((result: any) => {
        if (result.id === id) {
          return result;
        } else {
          return null;
        }
      });
    if (tempResult) {
      console.info(`current claue ${tempResult}`);
      this.newEnrtry = {
        title: tempResult.title,
        overview: tempResult.overview,
        image: tempResult.poster_path,
        apiGenreIds: tempResult.genre_ids,
        apiId: tempResult.id,
        kind: tempResult.media_type,
      };
    }
    console.debug(this.newEnrtry);
  }
}
