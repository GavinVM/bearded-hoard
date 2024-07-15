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
  isPriceRangeLoading!: boolean;
  minPrice!:number;
  maxPrice!:number;
  priceRangeTimeoutList!: any[]

  //filter states indicators  
  reorderValue!: string;
  minPriceInput!:string;
  maxPriceInput!:string;
  formatSegement!:string
  


  constructor(private appDataService: AppDataService,
              private menuController: MenuController ) { }

  ngOnInit() {
    this.iconCex = environment.icons('cex')
    this.isloading = true;
    this.isPriceRangeLoading = false;
    this.minPrice = 0
    this.maxPrice = 0
    this.appDataService.cexListReadyEmitter.subscribe((list: CexEntry[]) => this.handleCexList(list))
    this.appDataService.getCexList();
    this.menuController.close('filtersMenu');
    this.originalCexlist = [];
    this.previousFilterStateCexList = [];
    this.priceRangeTimeoutList = []

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
      this.originalCexlist = [...this.cexList]
      this.isloading = false;
      this.isNoResults = false;
      this.menuController.open('filtersMenu')
    } else {
      this.isNoResults = true;
    }
  }

  setFilterDefaults(){
    this.reorderValue = 'az'
    this.minPriceInput = '';
    this.maxPriceInput = '';
    this.formatSegement = 'all';
  }

  revealFilterMenu(){
    this.menuController.open('filtersMenu')
  }

  closeFilterMenu(){
    this.menuController.close('filtersMenu')
  }

  getMediaTypeIcon(mediaType:string): string{
    switch(mediaType){
      case 'blu-ray':
        return environment.icons('blu-ray');
      case '4k':
        return environment.icons('4k');
      default:
        return '';
    }
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
        
        };        
    
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
                
        } else {
          this.cexList = this.previousFilterStateCexList
          notSortFlag = true
        }
      break;
      default:
        notSortFlag = true;
    } 

    if(notSortFlag) return 

    this.previousFilterStateCexList = [...this.cexList];
    this.cexList.sort((a:CexEntry, b:CexEntry) => reorderFunction(a,b));
    console.log(`mrTracker.CexIntergrationComponent.reorderList:: finishing`)
  }

  priceRangeFilter(event:any){
      console.log(`mrTracker.CexIntergrationComponent.priceRangeFilter:: strating`)
      console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter:: passed in`, event)

      if(event.srcElement.name == 'min') this.minPrice = event.detail.value != '' ? event.detail.value : 0 
      if(event.srcElement.name == 'max') this.maxPrice = event.detail.value != '' ? event.detail.value : 0 
      
      this.isPriceRangeLoading = true;

      this.priceRangeTimeoutList.push(setTimeout(() => {
        console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter.timeout:: starting`)
        console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter.timeout:: current state - min value ${this.minPrice} max value ${this.maxPrice} and price timeout`, this.priceRangeTimeoutList)

        if(this.priceRangeTimeoutList) {
          console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter:: previous timeoutset, clearing and running clearfilters`)
          clearTimeout(this.priceRangeTimeoutList.pop())
          this.clearFilters()
        }

        if(this.minPrice != 0 && this.maxPrice != 0){
          this.cexList = this.cexList.filter((cexEntry: CexEntry) => cexEntry.cost >= this.minPrice && cexEntry.cost <= this.maxPrice)
        } else if(this.minPrice != 0) {
          this.cexList = this.cexList.filter((cexEntry: CexEntry) => cexEntry.cost >= this.minPrice)
        } else if(this.maxPrice != 0) {
          this.cexList = this.cexList.filter((cexEntry: CexEntry) =>  cexEntry.cost <= this.maxPrice)
        }
        console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter.timeout:: current number of time outs ${this.priceRangeTimeoutList.length}`)
        this.isPriceRangeLoading = false;

        console.log(`mrTracker.CexIntergrationComponent.priceRangeFilter.timeout:: finishing`)
      }, 2000)
    );
    console.log(`mrTracker.CexIntergrationComponent.priceRangeFilter:: timeout set`)
    console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter:: current number of time outs ${this.priceRangeTimeoutList.length}`)
    console.log(`mrTracker.CexIntergrationComponent.priceRangeFilter:: finishing`)
  }

  formatFilter(event:any){
    console.log(`mrTracker.CexIntergrationComponent.formatFilter:: starting`)
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: passed in ${event.detail.value}`)
    let filterFunction: any;
    let noFilter: boolean = false;
    if(this.previousFilterStateCexList.length == 0) this.previousFilterStateCexList = [...this.cexList]
    this.cexList = [...this.previousFilterStateCexList]
    switch(event.detail.value){
      case 'bl':
        filterFunction = (cexEntry:CexEntry) => {
          console.debug(`mrTracker.CexIntergrationComponent.formatFilter.bluray:: current format ${cexEntry.format}`)
          return cexEntry.format == 'Bluray'
        }
      break;
      case '4k':
        filterFunction = (cexEntry:CexEntry) => {
          console.debug(`mrTracker.CexIntergrationComponent.formatFilter.4k:: current format ${cexEntry.format}`)
          return cexEntry.format == '4k'
        }
      break; 
      default:
        noFilter = true;
        break;
    }
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: list before filter`, [...this.cexList])
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: filter present ${!noFilter}`)

    if(noFilter){ 
      console.log(`mrTracker.CexIntergrationComponent.formatFilter:: finishing`)
      return 
    }

    
    this.cexList = this.cexList.filter((cexEntry:CexEntry) => filterFunction(cexEntry))
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: list after`, [...this.cexList])
    console.log(`mrTracker.CexIntergrationComponent.formatFilter:: finishing`)
  }

  clearFilters(){
    this.cexList = this.originalCexlist;
    this.setFilterDefaults();
  }
  

}
