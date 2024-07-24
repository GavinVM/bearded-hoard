import { Component } from '@angular/core';
import { TabsService } from '../service/tabs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  cexOutline!: string;

  constructor(private tabService: TabsService) {
    this.cexOutline = environment.icons('cex', true);
  }

  tabChangeHandler(event:{tab: string}){
    this.tabService.triggerTabChangingEmmiter(event.tab);
  }

}
