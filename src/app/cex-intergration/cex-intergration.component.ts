import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CexEntry } from '../model/cex-entry.model';
import { AppDataService } from '../service/app-data.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cex-intergration',
  templateUrl: './cex-intergration.component.html',
  styleUrls: ['./cex-intergration.component.scss'],
})
export class CexIntergrationComponent  implements OnInit {

  iconCex!: string;
  cexList!: CexEntry[];
  originalCexlist!: CexEntry[];
  previousFilterStateCexList!: CexEntry[];
  isloading!: boolean;
  isNoResults!: boolean;

  //filter states indicators
  isLowHighChecked!: boolean;
  isHighLowChecked!: boolean;
  titleOrderSegement!: string;

  constructor(private appDataService: AppDataService,
              private menuController: MenuController ) { }

  ngOnInit() {
    this.iconCex = environment.icons('cex')
    this.isloading = true;
    this.appDataService.cexListReadyEmitter.subscribe((list: CexEntry[]) => this.handleCexList(list))
    this.appDataService.getCexList();
    this.menuController.close('filtersMenu');
    this.originalCexlist = [];
    this.previousFilterStateCexList = [];

    this.setFilterDefaults()
    
  }

  handleCexList(list: CexEntry[]){
    console.debug('how many times this runs')
    if(list.length > 0){
      this.cexList = list.sort((a:CexEntry, b:CexEntry) => {
        if (a.description < b.description) {
          return -1;
        }
        if (a.description > b.description) {
          return 1;
        }
        return 0;
      
      });
      this.setOriginalCexList(this.cexList)
      this.isloading = false;
      this.isNoResults = false;
    } else {
      this.isNoResults = true;
    }
  }

  setFilterDefaults(){
    this.isLowHighChecked = false;
    this.isHighLowChecked = false;
    this.titleOrderSegement = 'az'
  }

  revealFilterMenu(){
    this.menuController.open('filtersMenu')
  }

  closeFilterMenu(){
    this.menuController.close('filtersMenu')
  }

  reorderList(listOrderOption:any){
    console.log(`mrTracker.CexIntergrationComponent.reorderList:: starting`)
    console.debug(`mrTracker.CexIntergrationComponent.reorderList:: passed in`, listOrderOption)
    let reorderFunction: any;
    let notSortFlag:boolean = false;
    switch(listOrderOption.detail.value){
      case 'az':
        reorderFunction = (a:CexEntry, b:CexEntry) => {
          if (a.description < b.description) {
            return -1;
          }
          if (a.description > b.description) {
            return 1;
          }
          return 0;
        
        }
      break;
      case 'za':
        reorderFunction = (a:CexEntry, b:CexEntry) => {
          if (a.description > b.description) {
            return -1;
          }
          if (a.description < b.description) {
            return 1;
          }
          return 0;
        
        }
      break;
      case 'lh':
        if(listOrderOption.detail.checked) {
          reorderFunction = (a:CexEntry, b:CexEntry) => {
            if (a.cost < b.cost) {
              return -1;
            }
            if (a.cost > b.cost) {
              return 1;
            }
            return 0;
          
          }
          this.isHighLowChecked = false;
          this.isLowHighChecked = true;
        
        } else {
          this.cexList = this.previousFilterStateCexList
          notSortFlag = true
        } 
      break;
      case 'hl':
        if(listOrderOption.detail.checked) {
          reorderFunction = (a:CexEntry, b:CexEntry) => {
            if (a.cost > b.cost) {
              return -1;
            }
            if (a.cost < b.cost) {
              return 1;
            }
            return 0;
          
          }
          this.isLowHighChecked = false;
          this.isHighLowChecked = true;
        } else {
          this.cexList = this.previousFilterStateCexList
          notSortFlag = true
        }
      break;
      default:
        notSortFlag = true;
    } 

    if(notSortFlag) return 

    this.updatePreviousCexList(this.cexList);
    this.cexList.sort((a:CexEntry, b:CexEntry) => reorderFunction(a,b));
  }

  clearFilters(){
    this.cexList = this.originalCexlist;
    this.setFilterDefaults();
  }

  updatePreviousCexList(cexlist: CexEntry[]){
    this.previousFilterStateCexList = cexlist;
  }

  setOriginalCexList(startingCexList: CexEntry[]){
    this.originalCexlist = startingCexList;
  }
  

}
