import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';
import { TabsService } from '../service/tabs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tracker',
  templateUrl: 'tracker.page.html',
  styleUrls: ['tracker.page.scss']
})
export class TrackerPage implements OnInit{

  isLoading!: boolean;
  isWaitingForStorage!: boolean;
  trackerList!: Entry[];
  imagePreFix!: string;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService) {}

  ngOnInit(){
    console.info(`mrTracker.TrackerPage.ngOnInit:: starting`)
    this.isLoading = true;
    this.isWaitingForStorage = false;
    this.imagePreFix = environment.tmdbImageBase;
    this.tabService.tabChangingEmiter.subscribe(tab => this.activeTabReload(tab))
    this.loadTrackerList();
    console.info(`mrTracker.TrackerPage.ngOnInit:: finishing`)
  }

  activeTabReload(tabName:string){
    console.info(`mrTracker.TrackerPage.activeTabReload:: starting`)
    console.log(`tab changing to ${tabName}`)
    if(tabName.includes('tracker')){
      console.info(`mrTracker.TrackerPage.activeTabReload:: this component tab active, loading data`)
      this.loadTrackerList();
      console.info(`mrTracker.TrackerPage.activeTabReload:: data loaded`)
    }
    console.info(`mrTracker.TrackerPage.activeTabReload:: finishing`)
  }

  async loadTrackerList(){
    console.info(`mrTracker.TrackerPage.loadTrackerList:: ${this.isWaitingForStorage ? 'restarting' : 'starting'}`)

    this.appDataService.getTrackerList()
    .then((response: StorageResponse) => {
      if(response.status){
        console.info(`mrTracker.TrackerPage.loadTrackerList:: storage ready getting list`)
        this.trackerList = response.item?? []
        this.isLoading = false;
        console.log(`got the list:`)
        console.log(this.trackerList)
        console.info(`mrTracker.TrackerPage.loadTrackerList:: finishing`)
        this.isWaitingForStorage = false;
      } else {
        if(response.errorMessage){
          console.info('mrTracker.TrackerPage.loadTrackerList:: list empty, starting new list')
          this.trackerList = []
        } else {
          this.isWaitingForStorage = true;
          console.info(`mrTracker.TrackerPage.loadTrackerList:: storage not ready, retrying in 2 seconds`)
          setTimeout(() => {
            this.loadTrackerList();
          }, 2000)
          
        }
      }
      
    })
  }

  

}
