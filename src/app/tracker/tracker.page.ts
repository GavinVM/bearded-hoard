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
  trackerList!: Entry[];
  imagePreFix!: string;

  constructor(private appDataService: AppDataService,
              private tabService: TabsService) {}

  ngOnInit(){
    this.isLoading = true;
    this.imagePreFix = environment.tmdbImageBase;
    this.tabService.tabChangingEmiter.subscribe(tab => this.reloadForTabChange(tab))
    this.appDataService.getTrackerList()
    .then((response: StorageResponse) => {
      if(response.status){
        this.trackerList = response.item?? []
        
        console.log(`got the list:`)
        console.log(this.trackerList)
      } else {
        console.error('list failed')
        this.trackerList = []
      }
      this.isLoading = false;
    })
  }

  reloadForTabChange(tabName:string){
    console.log(`tab changing to ${tabName}`)
    if(tabName.includes('tracker')){
      this.ngOnInit();
    }
  }

  

}
