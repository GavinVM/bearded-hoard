import { Component } from '@angular/core';
import { TabsService } from '../service/tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private tabService: TabsService) {}

  tabChangeHandler(event:{tab: string}){
    this.tabService.triggerTabChangingEmmiter(event.tab);
  }

}
