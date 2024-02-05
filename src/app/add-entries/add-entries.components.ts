import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { AppDataService } from '../services/appData.service';
import { Entry } from '../model/entry.model';
import { ISearchOptions } from '../model/searchOptions.model';
import { Genre } from '../model/genre.model';
import { group } from '@angular/animations';
import { startWith } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-entries',
  templateUrl: './add-entries.component.html',
  styleUrls: ['./add-entries.component.css'],
})
export class AddEntriesComponent implements OnInit {
  searchField!: FormControl;
  genreControl!: FormControl;
  newEnrtry!: Entry;
  results!: any;
  options!: ISearchOptions[];
  genreList!: Genre[];
  showForm!: boolean;
  addOnBlur = true;
  step!: number;
  entries!: Entry[];

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private appDataService: AppDataService,
              private snackBar: MatSnackBar) {
    this.searchField = new FormControl('');

    this.newEnrtry = {
      title: '',
      overview: '',
      image: '',
      genres: [],
      apiId: 0,
      kind: '',
    };
  }

  ngOnInit() {
    this.showForm = false;
    this.searchField.valueChanges.subscribe((val: string) => {
      if (val != '') {
        this.appDataService.getSearchResults(val).subscribe({
          next: (data: any) => {
            console.debug(data);
            this.results = data.results;
            this.options = data.results.filter((result:any) => result.media_type != 'person').map((result: any) => {
              return {
                title: result.media_type == 'tv'? result.name : result.title,
                id: result.id,
                mediaType: result.media_type,
                releaseYear: new Date(result.media_type == 'tv'? result.first_air_date : result.release_date).getFullYear().toString()
              };
            });
            console.debug(`MrTracker.AddEntriesComponent.ngOnInit - next line is options`)
            console.debug(this.options)
          },
          error: (error) => {
            console.error('oops');
            console.error(error);
            this.options = [];
          },
        });
      } else {
        this.options = [];
      }
    });

    this.genreControl?.valueChanges?.pipe()

    this.entries = [];
  }

  selectedOptions(event: any) {
    console.info(`MrTracker.AddEntriesComponent.selectedOtions - new line is the event object`);
    console.debug(event.value)
    let selection: ISearchOptions = event.value
    this.searchField.setValue(`${selection.title} | ${selection.releaseYear}`)
    let details = selection.mediaType === 'tv'? this.appDataService.geTvDetailsById(selection.id) : this.appDataService.getMovieDetailsById(selection.id);
    
    console.debug(details)

    details.subscribe({
      next: (details: any) => {
          this.newEnrtry = {
            title: details.title,
            overview: details.overview,
            image: details.poster_path,
            genres: details.genres,
            apiId: details.id,
            kind: selection.mediaType,
          };
        console.debug(this.newEnrtry);
        this.showForm = true;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  setStep(stepId:number){
    this.step = stepId;
  }

  descriptionDisplay(description: string){
    return description.length > 50? `${description.substring(0,(description.indexOf(' ', 50)))}...` : description
  }

  loadGenreList(mediaType:string){
    let list = mediaType === 'tv'? this.appDataService.getTvGenreList() : this.appDataService.getMovieGenreList();
    console.debug(list)
    list.subscribe({
      next: (genreListMaster: any) => {
        console.debug(genreListMaster)
        this.genreList = genreListMaster.genre
      },
    error: (error) => {
        console.error(error)
      }
    })
  }

  updateGenreList(action:string, genreEntry:Genre, event?:any){
    if(action === 'add'){

      this.genreList.forEach((genre:Genre) => {
        if(genre.name === genreEntry.name){
          this.newEnrtry.genres.push({
            name: genre.name,
            id: genre.id
          });
        }
      })

      event?.chipInput?.clear();
      
    } else if(action === 'remove'){
      this.newEnrtry.genres = this.newEnrtry.genres.filter(genre => genre.id != genreEntry.id);
    } 
  }

  displayGenres(genres: Genre[]){
    return genres.map(val => val.name)
  }

  saveEntry(){
    console.debug(`clear form clicked`)
    this.entries.push(this.newEnrtry);
    let title: string = this.newEnrtry.title;
    this.clearForm();
    this.snackBar.open(`${title} has been Saved`, 'close' , {duration: 3000})
    console.debug(this.entries)
  }

  clearForm(){
    console.debug(`clear form clicked`)
    this.newEnrtry = {
      title: '',
      overview: '',
      image: '',
      genres: [],
      apiId: 0,
      kind: '',
    };

    this.searchField.setValue('')
    this.showForm = false;
  }

}
