import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';

@Component({
  selector: 'app-tracker',
  templateUrl: 'tracker.page.html',
  styleUrls: ['tracker.page.scss']
})
export class TrackerPage implements OnInit{

  isLoading!: boolean;
  trackerList!: Entry[];

  constructor(private appDataService: AppDataService ) {}

  ngOnInit(){
    this.isLoading = true;
    this.appDataService.getTrackerList()
    .then((response: StorageResponse) => {
      if(response.status){
        this.trackerList = response.item
        console.log(`got the list:`)
        console.log(this.trackerList)
      } else {
        console.error('list failed')
        this.trackerList = []
      }
      this.isLoading = false;
    })
  }

  reloadForTabChange(){
    this.ngOnInit();
  }

}
