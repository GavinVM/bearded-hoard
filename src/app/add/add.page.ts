import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { StorageService } from '../service/storage.service';
import { switchMap } from 'rxjs';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';
import { TabsService } from '../service/tabs.service';
import { IonSearchbar } from '@ionic/angular';



@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddPage implements OnInit{

  toastMessage!: string;
  currentFormat!: string;
  isToast!: boolean;

  results!: any[];
  options!: any[];

  isSavedBluray!: Map<string, boolean>;
  isSaved4k!: Map<string, boolean>;
  isLoadingBluray!: Map<string, boolean>;
  isLoading4k!: Map<string, boolean>;

  @ViewChild('searchBarTextBox') searchbarTextBox!: IonSearchbar;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService
  ) {}

  ngOnInit(): void {
    this.results = [];
    this.options = [];
    this.isSavedBluray = new Map();
    this.isSaved4k = new Map();
    this.isLoadingBluray = new Map();
    this.isLoading4k = new Map();
    this.isToast = false;
    this.appDataService.savedEventEmittter.subscribe(response => this.handleSavingEvent(response));
    this.tabService.tabChangingEmiter.subscribe(tab => this.tabChange(tab));
  }

  tabChange(tab:string){
    if(!tab.includes('add')){
      this.options = [];
      this.searchbarTextBox.value = '';
    }
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
          this.isLoadingBluray = new Map();
          this.isLoading4k = new Map();
          this.options = data.results.filter((result:any) => result.media_type != 'person').map((result: any) => {
            this.isSavedBluray.set(result.id, false);
            this.isSaved4k.set(result.id, false);
            this.isLoadingBluray.set(result.id, false);
            this.isLoading4k.set(result.id, false);
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

  handleSelection( selection:any, saveState: boolean, format: string){
    console.log(selection)
    this.currentFormat = format;
    if(format == '4k'){
      this.isLoading4k.set(selection.id, true)
      this.isSaved4k.set(selection.id, saveState)
      
    } else {
      this.isLoadingBluray.set(selection.id, true)
      this.isSavedBluray.set(selection.id, saveState)
    }
    if(saveState){
      selection.format = format
      this.saveEntry(selection)
    }
  }

  saveEntry(selection: any){
    console.log(`mrTracker.AddPage.saveEntry:: starting`)
    this.appDataService.saveSelection(selection)
  }

  handleSavingEvent(selectionResponse: StorageResponse){
    console.log(`mrTracker.AddPage.saveEntry:: response passed back`, selectionResponse)
    console.log(`mrTracker.AddPage.saveEntry:: saving complete, checking status`)
    if(selectionResponse.status){
      console.log(`mrTracker.AddPage.saveEntry:: saved, triggering toast`)
      this.toastMessage = `${selectionResponse.item.title} was saved in ${this.currentFormat}`
      this.isToast = true;
    } else {
      console.error(`mrTracker.AddPage.saveEntry:: fail, error message - ${selectionResponse.errorMessage}`)
    }
    console.log(`mrTracker.AddPage.saveEntry:: saving process finished, loading complete`)
    if(this.currentFormat == '4k'){
      console.log(`mrTracker.AddPage.saveEntry:: setting id ${selectionResponse.item.apiId} 4k loading to false`, this.isLoading4k)
      this.isLoading4k.set(selectionResponse.item.apiId, false)
    } else {
      console.log(`mrTracker.AddPage.saveEntry:: setting id ${selectionResponse.item.apiId} bluray loading to false`, this.isLoadingBluray)
      this.isLoadingBluray.set(selectionResponse.item.apiId, false)
    }
    this.currentFormat = '';
  }
}
