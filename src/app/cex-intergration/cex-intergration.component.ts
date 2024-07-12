import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CexEntry } from '../model/cex-entry.model';
import { AppDataService } from '../service/app-data.service';

@Component({
  selector: 'app-cex-intergration',
  templateUrl: './cex-intergration.component.html',
  styleUrls: ['./cex-intergration.component.scss'],
})
export class CexIntergrationComponent  implements OnInit {

  iconCex!: string;
  cexList!: CexEntry[];
  isloading!: boolean;
  isNoResults!: boolean;

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    this.iconCex = environment.icons('cex')
    this.isloading = true;
    this.appDataService.cexListReadyEmitter.subscribe((list: CexEntry[]) => this.handleCexList(list))
    this.appDataService.getCexList();
    // this.cexList = [
    //   {
    //     cexId: '1',
    //     cost: 1,
    //     description: "test 1",
    //     format: 'Bluray'
    //   },
    //   {
    //     cexId: '2',
    //     cost: 2,
    //     description: "test 2",
    //     format: 'Bluray'
    //   },
    //   {
    //     cexId: '3',
    //     cost: 3,
    //     description: "test 3",
    //     format: 'Bluray'
    //   },
    //   {
    //     cexId: '4',
    //     cost: 1.5,
    //     description: "test 4",
    //     format: '4k'
    //   },
    //   {
    //     cexId: '5',
    //     cost: 2.5,
    //     description: "test 5",
    //     format: 'Bluray'
    //   },
    //   {
    //     cexId: '6',
    //     cost: 0.5,
    //     description: "test 6",
    //     format: '4K'
    //   },
    // ]
    
  }

  handleCexList(list: CexEntry[]){
    if(list.length > 0){
      this.cexList = list;
      this.isloading = false;
    } else {
      this.isNoResults = true;
    }
  }

  

}
