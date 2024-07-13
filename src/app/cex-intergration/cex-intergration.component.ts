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
    
  }

  handleCexList(list: CexEntry[]){
    if(list.length > 0){
      this.cexList = list;
      this.isloading = false;
    } else {
      this.isNoResults = true;

      let temp:string = ''
    }
  }

  

}
