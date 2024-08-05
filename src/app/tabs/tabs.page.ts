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
  isLandingPage!: boolean;
  largeScreenAjustment!: string;

  constructor(private tabService: TabsService) {
    this.cexOutline = environment.icons('cex', true);
  }

  tabChangeHandler(event:{tab: string}){
    this.tabService.triggerTabChangingEmmiter(event.tab);
  }

  ngOnInit(){
    console.info(`MrTracker.TabsPage.ngOnInit:: starting`)
    this.adjustlandingPage()
    fromEvent(window, 'resize').subscribe(() => this.adjustlandingPage())
    console.info(`MrTracker.TabsPage.ngOnInit:: finishing`)
  }

  adjustlandingPage(){
    console.debug(`MrTracker.TabsPage.setIsLandingPage:: screen width is ${window.screen.width} and hieght is ${window.screen.height}`)
    console.debug(`MrTracker.TabsPage.setIsLandingPage:: viewport width is ${window.innerWidth} and hieght is ${window.innerHeight}`)
    this.isLandingPage = window.screen.width >= 1280 && window.screen.height >= 1280
    this.largeScreenAjustment = window.innerWidth >= 1230 ? 'exampleFrame largeScreenAdjust' : 'exampleFrame'

    console.debug(`MrTracker.TabsPage.setIsLandingPage:: is landing page ${this.isLandingPage} and is large screen ${this.largeScreenAjustment}`)
  }

}
