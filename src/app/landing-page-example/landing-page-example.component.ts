import { Component, OnInit} from '@angular/core';
import { Entry } from '../model/entry.model';
import { environment } from 'src/environments/environment';

const GRID: string = 'grid';

@Component({
  selector: 'app-landing-page-example',
  templateUrl: './landing-page-example.component.html',
  styleUrls: ['./landing-page-example.component.scss', '../tracker/tracker.page.scss'],
})
export class LandingPageExampleComponent {

  isLoading!: boolean
  isGrid!: boolean
  trackerList!: Entry[]
  imagePreFix!: string
  cexOutline!: string

  constructor() { }

  ngOnInit() {
    this.isLoading = true;
    this.isGrid = true;
    this.imagePreFix = environment.tmdbImageBase;
    this.cexOutline = environment.icons('cex', true);
    this.trackerList = [
      {
          title: "Spaceballs",
          overview: "When the nefarious Dark Helmet hatches a plan to snatch Princess Vespa and steal her planet's air, space-bum-for-hire Lone Starr and his clueless sidekick fly to the rescue. Along the way, they meet Yogurt, who puts Lone Starr wise to the power of \"The Schwartz.\" Can he master it in time to save the day?",
          image: "/cIbr9JRJX4jENulVETd4cAofTAA.jpg",
          genres: [
              {
                  id: 35,
                  name: "Comedy"
              },
              {
                  id: 878,
                  name: "Science Fiction"
              }
          ],
          apiId: "957",
          mediaType: "movie",
          format: [
              "bluray",
              "4k"
          ]
      },
      {
          title: "Die Hard",
          overview: "NYPD cop John McClane's plan to reconcile with his estranged wife is thrown for a serious loop when, minutes after he arrives at her office, the entire building is overtaken by a group of terrorists. With little help from the LAPD, wisecracking McClane sets out to single-handedly rescue the hostages and bring the bad guys down.",
          image: "/7Bjd8kfmDSOzpmhySpEhkUyK2oH.jpg",
          genres: [
              {
                  id: 28,
                  name: "Action"
              },
              {
                  id: 53,
                  name: "Thriller"
              }
          ],
          apiId: "562",
          mediaType: "movie",
          format: [
              "bluray",
              "4k"
          ]
      },
      {
          title: "Die Hard 2",
          overview: "Off-duty cop John McClane is gripped with a feeling of déjà vu when, on a snowy Christmas Eve in the nation’s capital, terrorists seize a major international airport, holding thousands of holiday travelers hostage. Renegade military commandos led by a murderous rogue officer plot to rescue a drug lord from justice and are prepared for every contingency excepton: McClane’s smart-mouthed heroics.",
          image: "/drJgR9L9jY44DQZvvfrZ2YoGJmW.jpg",
          genres: [
              {
                  id: 28,
                  name: "Action"
              },
              {
                  id: 53,
                  name: "Thriller"
              }
          ],
          apiId: "1573",
          mediaType: "movie",
          format: [
              "bluray",
              "4k"
          ]
      },
      {
          title: "Red Dwar",
          season: "Series I",
          overview: "The adventures of the last human alive and his friends, stranded three million years into deep space on the mining ship Red Dwarf.",
          image: "/dAaVWMhCCrSuimSETs9Z5ZTZQ3v.jpg",
          genres: [ 
            {
              id: 35, 
              name: 'Comedy'}, 
            {
              id: 10765, 
              name: 'Sci-Fi & Fantasy'
            }
          ],
          apiId: "326",
          mediaType: "tv",
          format: [
              "bluray"
          ]
      }
  ]
    setTimeout(() => {
      this.isLoading = false;
    }, 2000)
  }

  toggleGridListView(event: any): void {
    console.info(`mrTracker.TrackerPage.toggleGridListView:: starting`)
    console.debug(`mrTracker.TrackerPage.toggleGridListView:: segemtn triggered passing in ->`, event)
    if(event.detail.value.includes(GRID)){
      this.isGrid = true;
    } else {
      this.isGrid = false;
    }
    console.info(`mrTracker.TrackerPage.toggleGridListView:: finishing`)
  }

  getMediaTypeIcon(mediaType:string): string{
    switch(mediaType){
      case 'bluray':
        return environment.icons('blu-ray');
      case '4k':
        return environment.icons('4k');
      default:
        return '';
    }
  }

  formatDetail(entry: Entry): string{
    let detailLength = entry.title.length > 15 ? 15 : 20; 
    return entry.overview.substring(0, entry.overview.indexOf(' ', detailLength))
  }
  


}
