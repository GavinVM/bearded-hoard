import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { StorageService } from '../service/storage.service';
import { switchMap } from 'rxjs';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';



@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddPage implements OnInit{

  toastMessage!: string;
  isToast!: boolean;

  results!: any[];
  options!: any[];

  isSavedBluray!: Map<string, boolean>;
  isSaved4k!: Map<string, boolean>;
  isLoading!: Map<string, boolean>;

  constructor(private appDataService: AppDataService) {}

  ngOnInit(): void {
    this.results = [];
    this.options = [];
    this.isSavedBluray = new Map();
    this.isSaved4k = new Map();
    this.isLoading = new Map();
    this.isToast = false;
    this.appDataService.savedEventEmittter.subscribe(response => this.handleSavingEvent(response));
  }
  
  getResults(event:any){
    const val = event.target.value;
    if (val != '') {
      this.appDataService.getSearchResults(val).subscribe({
        next: (data: any) => {
          console.debug(data);
          this.results = data.results;
          this.isSavedBluray = new Map();
          this.isSaved4k = new Map();
          this.isLoading = new Map();
          this.options = data.results.filter((result:any) => result.media_type != 'person').map((result: any) => {
            this.isSavedBluray.set(result.id, false);
            this.isSaved4k.set(result.id, false);
            this.isLoading.set(result.id, false);
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
  }

  handleSelection( selection:any, saveState: boolean, mediaType: string){
    console.log(selection)
    this.isLoading.set(selection.id, true)
    if(mediaType == '4k'){
      this.isSaved4k.set(selection.id, saveState)
    } else {
      this.isSavedBluray.set(selection.id, saveState)
    }
    if(saveState){
      this.saveEntry(selection, mediaType)
    }
  }

  saveEntry(selection: any, media_type:string){
    console.log(`mrTracker.AddPage.saveEntry:: starting`)
    this.appDataService.saveSelection(selection, media_type)
  }

  handleSavingEvent(selectionResponse: StorageResponse){
    console.log(`mrTracker.AddPage.saveEntry:: response passed back`, selectionResponse)
    console.log(`mrTracker.AddPage.saveEntry:: saving complete, checking status`)
    if(selectionResponse.status){
      console.log(`mrTracker.AddPage.saveEntry:: saved, triggering toast`)
      this.toastMessage = `${selectionResponse.item.title} was saved in ${selectionResponse.item.mediaType[selectionResponse.item.mediaType.length > 1 ? 1 : 0]}`
      this.isToast = true;
    } else {
      console.error(`mrTracker.AddPage.saveEntry:: fail, error message - ${selectionResponse.errorMessage}`)
    }
    console.log(`mrTracker.AddPage.saveEntry:: saving process finished, loading complete`)
      this.isLoading.set(selectionResponse.item.id, false)
  }
}
