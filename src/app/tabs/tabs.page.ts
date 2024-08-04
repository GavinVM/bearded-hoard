import { Component } from '@angular/core';
import { TabsService } from '../service/tabs.service';
import { environment } from 'src/environments/environment';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  cexOutline!: string;
  isLandingPage!: boolean

  constructor(private tabService: TabsService) {
    this.cexOutline = environment.icons('cex', true);
  }

  tabChangeHandler(event:{tab: string}){
    this.tabService.triggerTabChangingEmmiter(event.tab);
  }

  ngOnInit(){
    console.info(`MrTracker.TabsPage.ngOnInit:: screen width is ${window.screen.width}`)
    this.setIsLandingPage(window.screen.width, window.screen.height)
    fromEvent(window, 'resize').subscribe(() => this.setIsLandingPage(window.screen.width, window.screen.height))
  }

  setIsLandingPage(screenWidth: number, screenHeight: number){
    console.info(`MrTracker.TabsPage.setIsLandingPage:: screen width is ${window.screen.width}`)
    this.isLandingPage = screenWidth >= 1280 && screenHeight >= 1280
  }

}
