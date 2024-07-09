import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { StorageService } from '../service/storage.service';
import { forkJoin, map, mergeMap, of, switchMap } from 'rxjs';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';
import { TabsService } from '../service/tabs.service';
import { IonSearchbar } from '@ionic/angular';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddPage implements OnInit{

  toastMessage!: string;
  currentFormat!: string;
  icon4KOutline!: string;
  icon4K!: string;
  iconBlurayOutline!: string;
  iconBluray!: string;
  isToast!: boolean;
  isSeasonDetailsRunning!: boolean;

  results!: any[];
  options!: any[];
  seasonsDetails!: any

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
    this.seasonsDetails =[];
    this.isSavedBluray = new Map();
    this.isSaved4k = new Map();
    this.isLoadingBluray = new Map();
    this.isLoading4k = new Map();
    this.isToast = false;
    this.icon4KOutline = environment.icons('4k', true);
    this.icon4K = environment.icons('4k');
    this.iconBlurayOutline = environment.icons('blu-ray', true);
    this.iconBluray = environment.icons('blu-ray');
    this.isSeasonDetailsRunning = false;
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
    this.options = [];
    this.isSavedBluray = new Map();
    this.isSaved4k = new Map();
    this.isLoadingBluray = new Map();
    this.isLoading4k = new Map();
    if (val != '') {
      this.appDataService.getSearchResults(val).pipe(
          mergeMap((api:any) => {
            return api.results.filter((result:any) => result.media_type != 'person').map((result:any) => {
                return this.appDataService.geTvDetailsById(result.id, result.media_type, result).pipe(map((result:any) => {  return result}))
              })
            } 
          )
        ).subscribe({
          next: (data: any) => {
            console.debug(data);
            this.results = data;
            data.subscribe((result: any) => {
              this.isSavedBluray.set(result.id, false);
              this.isSaved4k.set(result.id, false);
              this.isLoadingBluray.set(result.id, false);
              this.isLoading4k.set(result.id, false);
              if(result.media_type != 'movie') {
                this.formatResultsForTvSeasons(result).forEach((season:any) => {
                  this.options.push(season);
                })
              } else {
                this.options.push({
                  title: result.title,
                  id: result.id,
                  mediaType: result.media_type,
                  releaseYear: new Date(result.release_date).getFullYear().toString()
                })
              }
            });
            console.debug(`MrTracker.AddEntriesComponent.ngOnInit - next line is options`)
            console.debug(this.options)
          },
          error: (error) => {
            console.error('oops');
            console.error(error);
            this.options = [];
          } 
        })
        
    }
  }

  formatResultsForTvSeasons(result:any){
    console.log("`mrTracker.AddPage.saveEntry:: result", result)
    let tempOptions: any[] = [];
    result.seasons.forEach((season:any) => {
      tempOptions.push({
        title: result.name,
        season: season.name,
        id: result.id,
        mediaType: 'tv',
        releaseYear: new Date(season.air_date).getFullYear().toString()
      })
    });

    tempOptions.push({
      title: result.name,
      season: 'Box Set',
      id: result.id,
      mediaType: result.media_type,
      releaseYear: new Date(result.first_air_date).getFullYear().toString()
    }) 
    return tempOptions;
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
