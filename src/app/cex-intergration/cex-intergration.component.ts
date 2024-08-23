import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CexEntry } from '../model/cex-entry.model';
import { AppDataService } from '../service/app-data.service';
import { IonInput, IonSegment, IonSelect, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-cex-intergration',
  templateUrl: './cex-intergration.component.html',
  styleUrls: ['./cex-intergration.component.scss'],
})
export class CexIntergrationComponent {

  iconCex!: string;
  cexList!: CexEntry[];
  originalCexlist!: CexEntry[];
  previousSortStateCexList!: CexEntry[];
  previousUnfilteredList!: CexEntry[];
  isloading!: boolean;
  isNoResults!: boolean;
  isPriceRangeLoading!: boolean;
  minPrice!:number;
  maxPrice!:number;
  priceRangeTimeoutList!: any[]

  //filter states indicators 
  @ViewChild('minPriceInput') minPriceInput!:IonInput;
  @ViewChild('maxPriceInput') maxPriceInput!:IonInput;
  
 @ViewChild('reorderSelect') reorderSelect!: IonSelect;
 @ViewChild('formatSegement') formatSegement!: IonSegment;

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
    this.previousSortStateCexList = [];
    this.previousUnfilteredList = [];
    this.priceRangeTimeoutList = []

    //redesign of the filter system, to apply filters each time with a presh list or have a falg system that update
    //list sources when a change is applied.
    
  }

  ngAfterViewInit(){
    this.setFilterDefaults();
  }

  handleCexList(list: CexEntry[]){
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
    } else {
      this.isNoResults = true;
    }
  }

  setFilterDefaults(){
    this.minPriceInput.value = '';
    this.maxPriceInput.value = '';
    this.formatSegement.value = 'all';
    this.reorderSelect.placeholder = 'A-Z';
    this.reorderSelect.value = 'az'
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
    this.isloading = true;
    console.debug(`mrTracker.CexIntergrationComponent.reorderList:: passed in`, listOrderOption)
    console.debug(`mrTracker.CexIntergrationComponent.reorderList:: selectedText is - `,  listOrderOption.srcElement.selectedText)
    let reorderFunction: any;
    let notSortFlag:boolean = false;

    this.reorderSelect.selectedText = listOrderOption.srcElement.selectedText

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
          reorderFunction = (a:CexEntry, b:CexEntry) => {
            if (a.cost < b.cost) {
              return -1;
            }
            if (a.cost > b.cost) {
              return 1;
            }
            return 0;
          
          }  
      break;
      case 'hl':
          reorderFunction = (a:CexEntry, b:CexEntry) => {
            if (a.cost > b.cost) {
              return -1;
            }
            if (a.cost < b.cost) {
              return 1;
            }
            return 0;
          
          }
      break;
      default:
        notSortFlag = true;
    } 

    if(notSortFlag) return 

    this.cexList.sort((a:CexEntry, b:CexEntry) => reorderFunction(a,b));
    this.isloading = false;
    console.log(`mrTracker.CexIntergrationComponent.reorderList:: finishing`)
  }

  priceRangeFilter(event:any){
      console.log(`mrTracker.CexIntergrationComponent.priceRangeFilter:: strating`)
      console.debug(`mrTracker.CexIntergrationComponent.priceRangeFilter:: passed in`, event)
      
      if(event.srcElement.name == 'min') this.minPrice = event.detail.value != '' ? event.detail.value : 0 
      if(event.srcElement.name == 'max') this.maxPrice = event.detail.value != '' ? event.detail.value : 0 
      this.isloading = true;
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
        this.isloading = false;

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
    this.isloading = true;

    let filterFunction: any;
    let noFilter: boolean = false;
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: previous filter list has ${this.previousUnfilteredList.length} entrires`)
    if(this.previousUnfilteredList.length == 0) this.previousUnfilteredList = [...this.cexList]
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: previous filter list is`, this.previousUnfilteredList)
    this.cexList = [...this.previousUnfilteredList]
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
      console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: setting list to previous unfilter list`, [...this.previousUnfilteredList])
      // this.cexList = [...this.previousUnfilteredList]
      this.previousUnfilteredList = []
      this.isloading = false;
      console.log(`mrTracker.CexIntergrationComponent.formatFilter:: finishing`)
      return 
    }

    
    this.cexList = this.cexList.filter((cexEntry:CexEntry) => filterFunction(cexEntry))
    this.isloading = false;
    
    console.debug(`mrTracker.CexIntergrationComponent.formatFilter:: list after`, [...this.cexList])
    console.log(`mrTracker.CexIntergrationComponent.formatFilter:: finishing`)
  }

  clearFilters(){
    console.log(`mrTracker.CexIntergrationComponent.clearFilters:: starting`)
    console.log(`mrTracker.CexIntergrationComponent.clearFilters:: setting cex list to `, [...this.originalCexlist])
    this.isloading = true;
    this.cexList = [...this.originalCexlist];
    this.setFilterDefaults();
    this.isloading = false;
    console.log(`mrTracker.CexIntergrationComponent.clearFilters:: finishing`)
  }
  
  // maintain state between filters, look at how previous filter is set

}
