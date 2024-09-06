import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { fromEvent, map, mergeMap, Observable } from 'rxjs';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';
import { TabsService } from '../service/tabs.service';
import { IonActionSheet, IonSearchbar, ToastController } from '@ionic/angular';
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
  isActionSheet!: boolean;
  isSeasonDetailsRunning!: boolean;
  isOnline!: boolean;

  results!: any[];
  options!: any[];
  existingEntryData!: {id:string, format:string};
  currentTrackerList!: Entry[];
  seasonsDetails!: any
  removeExistingEntryActionSheetButtons!: any;

  isSavedBluray!: Map<string, boolean>;
  isSaved4k!: Map<string, boolean>;
  isLoadingBluray!: Map<string, boolean>;
  isLoading4k!: Map<string, boolean>;

  onlineEvent!: Observable<Event>;
  offlineEvent!: Observable<Event>;

  @ViewChild('searchBarTextBox') searchbarTextBox!: IonSearchbar;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService,
              private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.results = [];
    this.options = [];
    this.currentTrackerList = [];
    this.seasonsDetails =[];
    this.isSavedBluray = new Map();
    this.isSaved4k = new Map();
    this.isLoadingBluray = new Map();
    this.isLoading4k = new Map();
    this.existingEntryData = {id:'', format:''}
    this.icon4KOutline = environment.icons('4k', true);
    this.icon4K = environment.icons('4k');
    this.iconBlurayOutline = environment.icons('blu-ray', true);
    this.iconBluray = environment.icons('blu-ray');
    this.isSeasonDetailsRunning = false;
    this.isOnline = true;
    this.appDataService.savedEventEmittter.subscribe(response => this.handleSavingEvent(response));
    this.tabService.tabChangingEmiter.subscribe(tab => this.tabChange(tab));
    this.appDataService.trackerListEventEmittter.subscribe((trackerResponse:StorageResponse) => {
      console.info(`MrTracker.AddPage.ngOnInit.trackerListEventEmitter:: triggered`)
      console.debug(`MrTracker.AddPage.ngOnInit.trackerListEventEmitter:: response recieved,`, trackerResponse)
      if(trackerResponse.status){ 
        this.currentTrackerList = trackerResponse.item 
      } else {
        this.currentTrackerList = []
      } 
      console.info(`MrTracker.AddPage.ngOnInit.trackerListEventEmitter:: handeled`)
    })
    this.removeExistingEntryActionSheetButtons = [
        {
          text: 'Continue',
          role: 'cancel',
          data: {
            action: 'cancel',
          }
        }
      ];
    this.appDataService.getTrackerList()
    fromEvent(window, 'online').subscribe(() => this.setOnlineOfflineStatus(true));
    fromEvent(window, 'offline').subscribe(() => this.setOnlineOfflineStatus(false))
  }

  setOnlineOfflineStatus(statusUpdate:boolean){
    this.isOnline = statusUpdate
    if(statusUpdate){
      console.info('MrTracker.AddPage.ngOnInit.onlineOfflineListener:: app is online')
    } else {
      console.warn('MrTracker.AddPage.ngOnInit.onlineOfflineListener:: app has gone offline')
    }
  }

  tabChange(tab:string){
    console.info(`MrTracker.AddPage.tabChange:: triggered`)
    console.debug(`MrTracker.AddPage.tabChange:: tab is ${tab}`)
    if(!tab.includes('add')){
      console.debug(`MrTracker.AddPage.tabChange:: clearing optins and seachbox value`)
      this.options = [];
      this.searchbarTextBox.value = '';
      console.debug(`MrTracker.AddPage.tabChange:: getting current list`)
      this.appDataService.getTrackerList()
    }
    console.info(`MrTracker.AddPage.tabChange:: handeled`)
  }
  
  getResults(event:any){
    console.debug(`MrTracker.AddPage.getResults:: starting`)
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

              
              if(result.media_type != 'movie') {
                this.formatResultsForTvSeasons(result).forEach((season:any) => {
                  this.options.push(season);
                })
              } else {
                this.isSavedBluray.set(result.id, false);
                this.isSaved4k.set(result.id, false);
                this.isLoadingBluray.set(result.id, false);
                this.isLoading4k.set(result.id, false);
                this.options.push({
                  title: result.title,
                  id: result.id,
                  mediaType: result.media_type,
                  releaseYear: new Date(result.release_date).getFullYear().toString()
                })
              }

              console.debug(`MrTracker.AddPage.getResults:: checking if result already exists for option`, this.options)
              this.currentTrackerList.forEach((entry:Entry) => {
                let tempId = entry.mediaType == 'tv' ? entry.seasonId?? entry.apiId : entry.apiId
                if(entry.format.indexOf('4k') != -1){
                  this.isSaved4k.set(tempId, true);
                }
                if(entry.format.indexOf('bluray') != -1){
                  this.isSavedBluray.set(tempId, true);
                }
              });

            });
            console.debug(`MrTracker.AddPage.getResults - next line is options`, this.options)
          },
          error: (error) => {
            console.error('MrTracker.AddPage.getResults:: Error getting search results,', error);
            // console.error(error);
            this.options = [];
            console.debug(`MrTracker.AddPage.getResults:: finishing`)
          } 
        })
        
    }
  }

  formatResultsForTvSeasons(result:any): any[] {
    console.info("`mrTracker.AddPage.formatResultsForTvSeasons:: starting", result)
    let tempOptions: any[] = [];
    result.seasons.forEach((season:any) => {
      this.isSavedBluray.set(season.id, false);
      this.isSaved4k.set(season.id, false);
      this.isLoadingBluray.set(season.id, false);
      this.isLoading4k.set(season.id, false);
      tempOptions.push({
        title: result.name,
        season: season.name,
        parentId: result.id,
        id: season.id,
        mediaType: 'tv',
        releaseYear: new Date(season.air_date).getFullYear().toString()
      })
    });

    this.isSavedBluray.set(result.id, false);
    this.isSaved4k.set(result.id, false);
    this.isLoadingBluray.set(result.id, false);
    this.isLoading4k.set(result.id, false);

    tempOptions.push({
      title: result.name,
      season: 'Box Set',
      id: result.id,
      parentId: result.id,
      mediaType: 'tv',
      releaseYear: new Date(result.first_air_date).getFullYear().toString()
    }) 
    console.debug(`MrTracker.AddPage.formatResultsForTvSeasons:: list being returned`, tempOptions)
    console.info(`MrTracker.AddPage.formatResultsForTvSeasons:: starting`)
    return tempOptions;
  }

  handleSelection( selection:any, saveState: boolean, format: string){
    console.info(`MrTracker.AddPage.handleSelection:: starting`)
    console.debug(`MrTracker.AddPage.handleSelection:: passed in params are saveState - ${saveState}, format ${format} and selection -`, selection)
    this.currentFormat = format;
    if(format == '4k'){
      this.isLoading4k.set(selection.id, true)
      this.isSaved4k.set(selection.id, saveState)      
    } else {
      this.isLoadingBluray.set(selection.id, true)
      this.isSavedBluray.set(selection.id, saveState)
    }
    if(saveState){
      console.debug(`MrTracker.AddPage.handleSelection:: saving selection`)
      selection.format = format
      this.saveEntry(selection)
    } else {
      console.debug(`MrTracker.AddPage.handleSelection:: not in saving mode checking entry is in currnet list`, this.currentTrackerList)
      if(this.currentTrackerList.filter((entry:Entry) => entry.apiId == selection.id).length == 1){
        console.debug(`MrTracker.AddPage.handleSelection:: entry in list, informing the user`)
        this.createToast('Entry Already Exists', 'warning');
        if(format == '4k'){
          this.isLoading4k.set(selection.id, false)
          this.isSaved4k.set(selection.id, true)     
        } else {
          this.isLoadingBluray.set(selection.id, false)
          this.isSavedBluray.set(selection.id, true)
        }
      } else {
        console.error(`MrTracker.AddPage.handleSelection:: entry was not in current list but button indicated it did`)
        this.createToast('Error, clear search and try again.', 'danger');
      }
    }
  }

  saveEntry(selection: any){
    console.log(`mrTracker.AddPage.saveEntry:: starting`)
    this.appDataService.saveSelection(selection)
  }

  async createToast(toastMessage:string, color?:string){

    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 1000,
      color: color ?? 'default'
    });
    await toast.present();

  }

  handleSavingEvent(selectionResponse: StorageResponse){
    console.log(`mrTracker.AddPage.saveEntry:: response passed back`, selectionResponse)
    console.log(`mrTracker.AddPage.saveEntry:: saving complete, checking status`)
    if(selectionResponse.status){
      console.log(`mrTracker.AddPage.saveEntry:: saved, triggering toast`)
      this.createToast(`${selectionResponse.item.title} was saved in ${this.currentFormat}`, 'success');
      this.appDataService.getTrackerList();
    } else {
      console.error(`mrTracker.AddPage.saveEntry:: fail, error message - ${selectionResponse.errorMessage}`)
      this.createToast('Error in saving, clear search and try again.', 'danger');
    }
    console.log(`mrTracker.AddPage.saveEntry:: saving process finished, loading complete`)
    if(this.currentFormat == '4k'){
      console.log(`mrTracker.AddPage.saveEntry:: setting id ${(selectionResponse.item.mediaType =='tv' ? selectionResponse.item.seasonId : selectionResponse.item.apiId)} 4k loading to false`, this.isLoading4k)
      this.isLoading4k.set((selectionResponse.item.mediaType =='tv' ? selectionResponse.item.seasonId : selectionResponse.item.apiId), false)
    } else {
      console.log(`mrTracker.AddPage.saveEntry:: setting id ${(selectionResponse.item.mediaType =='tv' ? selectionResponse.item.seasonId : selectionResponse.item.apiId)} bluray loading to false`, this.isLoadingBluray)
      this.isLoadingBluray.set((selectionResponse.item.mediaType =='tv' ? selectionResponse.item.seasonId : selectionResponse.item.apiId), false)
    }
    this.currentFormat = '';
  }
}
