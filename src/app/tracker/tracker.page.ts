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
  isModalOpen!:boolean;
  isToast!: boolean;
  changeReorder!: boolean;
  savePopoverState!: boolean;
  trackerList!: Entry[];
  previousTrackerList!: Entry[];
  removeEntryList!: Entry[];
  deleteEntryList!: string[];
  imagePreFix!: string;
  reorderButtonState! :string;
  deleteEntryButtonState!: string;
  toastMessage!:string;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService) {}

  ngOnInit(){
    console.info(`mrTracker.TrackerPage.ngOnInit:: starting`)
    this.isLoading = true;
    this.isWaitingForStorage = false;
    this.isGrid = true;
    this.isReorder = false;
    this.isDelete = false;
    this.isModalOpen = false;
    this.changeReorder = false;
    this.savePopoverState = false;
    this.reorderButtonState = PENDING;
    this.deleteEntryButtonState = PENDING;
    this.toastMessage = '';
    this.previousTrackerList = []
    this.deleteEntryList = [];
    this.removeEntryList = [];
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
    console.debug(`mrTracker.TrackerPage.loadTrackerList:: got the list:`, this.trackerList)
    console.info(`mrTracker.TrackerPage.loadTrackerList:: finishing`)
  }

  toggleGridListView(event: any): void {
    console.info(`mrTracker.TrackerPage.toggleGridListView:: starting`)
    console.debug(`mrTracker.TrackerPage.toggleGridListView:: segemtn triggered passing in ->`, event)
    if(event.detail.value.includes(GRID)){
      this.isGrid = true;
    } else {
      this.isGrid = false;
      this.isReorder = false;
      this.deleteEntryList = [];
      this.isDelete = false;
    }
    console.info(`mrTracker.TrackerPage.toggleGridListView:: finishing`)
  }

  formatDetail(entry: Entry): string{
    let detailLength = entry.title.length > 15 ? 15 : 20; 
    let endPoint = entry.overview.indexOf(' ', detailLength) > 0 ? entry.overview.indexOf(' ', detailLength) : 20
    return entry.overview.substring(0, endPoint)
  }

  toggleCheckBoxes(){
    console.info(`mrTracker.TrackerPage.toggleCheckBoxes:: starting`)
    if(this.deleteEntryList.length == 0){
      console.info(`mrTracker.TrackerPage.toggleCheckBoxes:: delete list empty, checking all items`)
      this.deleteEntryList = this.trackerList.map((entry:Entry) => entry.apiId);
    } else {
      console.info(`mrTracker.TrackerPage.toggleCheckBoxes:: list populated clearting`)
      this.deleteEntryList = []
      if(this.removeEntryList.length > 0) {
        this.isLoading = true;
        this.trackerList = [...this.previousTrackerList]
        this.removeEntryList = []
        this.isLoading = false;
      }
    }
    console.info(`mrTracker.TrackerPage.toggleCheckBoxes:: finish`)
  }

  toggleDelete(){
    console.info(`mrTracker.TrackerPage.toggleDelete:: starting`)
    if(this.deleteEntryList.length == 0){
      console.info(`mrTracker.TrackerPage.toggleDelete:: closing the delete view`)
      this.isDelete = !this.isDelete;
      this.isReorder = false;
    } else {
      console.info(`mrTracker.TrackerPage.toggleDelete:: removing entries from list`)
      this.previousTrackerList = [...this.trackerList];
      this.removeEntryList = this.trackerList.filter((entry:Entry) => this.deleteEntryList.indexOf(entry.apiId) != -1)
      console.info(`mrTracker.TrackerPage.toggleDelete:: entries removed, removed list looks like -`, this.removeEntryList)
      console.info(`mrTracker.TrackerPage.toggleDelete:: opening confirm model`)
      this.isModalOpen = true;
    }
    console.info(`mrTracker.TrackerPage.toggleDelete:: finishing`)
  }

  getIsChecked(id:string):boolean {
    return this.deleteEntryList.indexOf(id) != -1
  }

  updateDeleteEntryList(apiId:string, checked:boolean){
    console.info(`mrTracker.TrackerPage.updateDeleteEntryList:: starting`)
    console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: current checked status is ${checked} and id is ${apiId}`)
    
    if(checked){
      console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: adding id to list`)
      this.deleteEntryList.push(apiId);
    } else {
      console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: removing id`)
      this.deleteEntryList = this.deleteEntryList.filter((id:string) => id != apiId);
    }
    console.debug(`mrTracker.TrackerPage.updateDeleteEntryList:: delete list is now`, this.deleteEntryList)
    console.info(`mrTracker.TrackerPage.updateDeleteEntryList:: finishing`)
  }

  deleteEntries(confirm:boolean){
    console.info(`mrTracker.TrackerPage.deleteEntries:: starting with confirm status - ${confirm}`)
    if(!confirm){
      console.info(`mrTracker.TrackerPage.deleteEntries:: closing the delete view`)
      this.isModalOpen = false;
    } else {
      console.info(`mrTracker.TrackerPage.deleteEntries:: removing entries from list`)
      this.isLoading = true;
      this.trackerList = this.trackerList.filter((entry:Entry) => this.deleteEntryList.indexOf(entry.apiId) == -1)
      console.info(`mrTracker.TrackerPage.deleteEntries:: entries removed, removed list looks like -`, this.removeEntryList)
      this.appDataService.updateTrackerList(this.trackerList).then((response:StorageResponse) => {
        console.info(`mrTracker.TrackerPage.deleteEntries.updateTrackerList:: response - `, response)
        if(response.status){
          this.toastMessage = 'Entries removed successfully';
          this.isGrid = true;
          this.isReorder = false;
          this.isDelete = false;
          this.isModalOpen = false;
          this.removeEntryList = [];
          this.deleteEntryList = [];
          this.isLoading = false;
          this.isToast = true;
        } else {
          this.toastMessage = 'Error deleting , please try again';
        }
        console.info(`mrTracker.TrackerPage.deleteEntries.updateTrackerList:: complete, closing modal`)
        this.isModalOpen = false;
      })

    }
  }


  toggleReorder(): void{
    console.info(`mrTracker.TrackerPage.toggleReorder:: starting`)
    if(!this.isReorder){
      console.info(`mrTracker.TrackerPage.toggleReorder:: setting to true`)
      this.previousTrackerList = [...this.trackerList]
      this.isReorder = true;
      this.isDelete = false;
      this.reorderButtonState = TOGGLED
      this.savePopoverState = true;
      console.info(`mrTracker.TrackerPage.toggleReorder:: ready to accept changes`)
    } else if(this.isReorder) {
      console.info(`mrTracker.TrackerPage.toggleReorder:: setting to false`)
      if(this.changeReorder){
        console.info(`mrTracker.TrackerPage.toggleReorder:: saving changes`)
        this.isLoading = true;
        this.appDataService.updateTrackerList(this.trackerList)
      .then((response: StorageResponse) => {
        if(!response.status){
          console.info(`mrTracker.TrackerPage.toggleReorder:: issue saving new order: \n\t\t\t\t${response.errorMessage}`)
          console.info(`mrTracker.TrackerPage.toggleReorder:: reverting changes`)
          this.toastMessage = 'Reorder Failed, please try again'
        } 
        this.isLoading = false;
      });
      } else {
        console.info(`mrTracker.TrackerPage.toggleReorder:: reverting state to statndard list`)
          this.reorderButtonState = PENDING
          this.isReorder = false
      }
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

  clearReorder(){
    console.info(`mrTracker.TrackerPage.trackerList:: starting`)
    this.trackerList = [...this.previousTrackerList];
    this.changeReorder = false;
    console.debug(`mrTracker.TrackerPage.trackerList:: trackerlist reset`)
    console.info(`mrTracker.TrackerPage.trackerList:: finishing`)
  }

  getMediaTypeIcon(mediaType:string): string{
    console.debug(`mrTracker.TrackerPage.getMediaTypeIcon:: getting icon for ${mediaType}`)
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
