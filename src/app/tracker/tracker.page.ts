import { Component, OnInit, ViewChild } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';
import { TabsService } from '../service/tabs.service';
import { environment } from 'src/environments/environment';
import { IonCheckbox, ItemReorderEventDetail } from '@ionic/angular';

const GRID: string = 'grid';
const TOGGLED: string = 'filled';
const PENDING: string = '';



@Component({
  selector: 'app-tracker',
  templateUrl: 'tracker.page.html',
  styleUrls: ['tracker.page.scss']
})
export class TrackerPage implements OnInit{

  isLoading!: boolean;
  isWaitingForStorage!: boolean;
  isGrid!: boolean;
  isReorder!: boolean;
  isDelete!: boolean;
  isItemChecked!: boolean;
  changeReorder!: boolean;
  savePopoverState!: boolean;
  trackerList!: Entry[];
  previousTrackerList!: Entry[];
  deleteEntryList!: string[];
  imagePreFix!: string;
  reorderButtonState! :string;
  deleteEntryButtonState!: string;

  @ViewChild('deleteListCheckbox') deleteListCheckbox!: IonCheckbox;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService) {}

  ngOnInit(){
    console.info(`mrTracker.TrackerPage.ngOnInit:: starting`)
    this.isLoading = true;
    this.isWaitingForStorage = false;
    this.isGrid = true;
    this.isReorder = false;
    this.isDelete = false;
    this.isItemChecked = false;
    this.changeReorder = false;
    this.savePopoverState = false;
    this.reorderButtonState = PENDING;
    this.deleteEntryButtonState = PENDING;
    this.previousTrackerList = []
    this.deleteEntryList = [];
    this.imagePreFix = environment.tmdbImageBase;
    this.tabService.tabChangingEmiter.subscribe(tab => this.activeTabReload(tab))
    this.appDataService.trackerListEventEmittter.subscribe(trackerList => this.loadTrackerList(trackerList))
    this.appDataService.getTrackerList();
    console.info(`mrTracker.TrackerPage.ngOnInit:: finishing`)
  }

  activeTabReload(tabName:string){
    console.info(`mrTracker.TrackerPage.activeTabReload:: starting`)
    console.log(`tab changing to ${tabName}`)
    if(tabName.includes('tracker')){
      console.info(`mrTracker.TrackerPage.activeTabReload:: this component tab active, loading data`)
      this.appDataService.getTrackerList();
      console.info(`mrTracker.TrackerPage.activeTabReload:: data loaded`)
    }
    console.info(`mrTracker.TrackerPage.activeTabReload:: finishing`)
  }

  loadTrackerList(trackerList: Entry[]){
    console.info(`mrTracker.TrackerPage.loadTrackerList:: ${this.isWaitingForStorage ? 'restarting' : 'starting'}`)

    this.trackerList = trackerList;
    this.isLoading = false;
    console.log(`got the list:`, this.trackerList)
    console.info(`mrTracker.TrackerPage.loadTrackerList:: finishing`)
  }

  toggleGridListView(event: any): void {
    console.info(`mrTracker.TrackerPage.toggleGridListView:: starting`)
    console.debug(`mrTracker.TrackerPage.toggleGridListView:: segemtn triggered passing in ->`, event)
    if(event.detail.value.includes(GRID)){
      this.isGrid = true;
    } else {
      this.isGrid = false;
    }
    console.info(`mrTracker.TrackerPage.toggleGridListView:: finishing`)
  }

  formatDetail(entry: Entry): string{
    let detailLength = entry.title.length > 15 ? 15 : 20; 
    return entry.overview.substring(0, entry.overview.indexOf(' ', detailLength))
  }

  clearCheckBoxes(){
    this.isItemChecked = false;
    this.deleteListCheckbox.checked = false;
  }

  toggleDelete(){
    console.info(`mrTracker.TrackerPage.toggleDelete:: starting`)
    this.isDelete = !this.isDelete;
    this.isReorder = false;

    console.info(`mrTracker.TrackerPage.toggleDelete:: finishing`)
  }

  updateDeleteEntryList(event:any){
    console.info(`mrTracker.TrackerPage.updateDeleteEntryList:: starting`)
    console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: passed in event, `, event)
    console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: current checked status is ${event.detail.checked} and id is ${event.detail.value}`)
    if(event.detail.checked){
      this.isItemChecked = true;
      console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: adding id to list`)
      this.deleteEntryList.push(event.detail.value);
    } else {
      console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: removing id`)
      this.deleteEntryList = this.deleteEntryList.filter((id:string) => id != event.detail.value);
    }
    console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: delete list is now`, this.deleteEntryList)
    console.info(`mrTracker.TrackerPage.updateDeleteEntryList:: finishing`)
  }

  toggleReorder(): void{
    console.info(`mrTracker.TrackerPage.toggleReorder:: starting`)
    if(!this.isReorder){
      console.info(`mrTracker.TrackerPage.toggleReorder:: setting to true`)
      this.previousTrackerList = this.trackerList
      this.isReorder = true;
      this.isDelete = false;
      this.reorderButtonState = TOGGLED
      this.savePopoverState = true;
      console.info(`mrTracker.TrackerPage.toggleReorder:: ready to accept changes`)
    } else if(this.isReorder) {
      console.info(`mrTracker.TrackerPage.toggleReorder:: setting to false`)
      if(this.changeReorder){
        console.info(`mrTracker.TrackerPage.toggleReorder:: saving changes`)
        this.appDataService.updateTrackerList(this.previousTrackerList)
      .then((response: StorageResponse) => {
        if(response.status){
          
        } else {
          console.info(`mrTracker.TrackerPage.toggleReorder:: issue saving new order: \n\t\t\t\t${response.errorMessage}`)
          console.info(`mrTracker.TrackerPage.toggleReorder:: reverting changes`)
          this.trackerList = this.previousTrackerList
        }
        
      })
      } 
      console.info(`mrTracker.TrackerPage.toggleReorder:: reverting state to statndard list`)
      this.reorderButtonState = PENDING
      this.isReorder = false;
    }
    console.info(`mrTracker.TrackerPage.toggleReorder:: finishing`)
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>){
    console.info(`mrTracker.TrackerPage.handleReorder:: starting`)
    if(!this.changeReorder) this.changeReorder = true;
    this.trackerList = ev.detail.complete(this.trackerList)
    console.info(`mrTracker.TrackerPage.handleReorder:: finishing`)
    // this.trackerList = ev.detail.complete(this.trackerList)
    
  }

  getMediaTypeIcon(mediaType:string): string{
    switch(mediaType){
      case 'bluray':
        return environment.icons('blu-ray');
      case '4k':
        return environment.icons('4k');
      default:
        return '';
    }
  }

}
