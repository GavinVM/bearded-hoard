import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  constructor() { }

  tabChangingEmiter: EventEmitter<string> = new EventEmitter();
  tabChangedEmmiter: EventEmitter<string> = new EventEmitter();

  triggerTabChangingEmmiter(tabName:string){
    this.tabChangingEmiter.emit(tabName);
  }

  triggerTabChangedEmmiter(tabName:string){
    this.tabChangedEmmiter.emit(tabName);
  }
}
