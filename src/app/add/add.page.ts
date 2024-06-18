import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { StorageService } from '../service/storage.service';
import { switchMap } from 'rxjs';
import { Entry } from '../model/entry.model';
import { StorageResponse } from '../model/storage-response.model';



@Component({
  selector: 'app-add',
  templateUrl: 'add.page.html',
  styleUrls: ['add.page.scss']
})
export class AddPage implements OnInit{

  toastMessage!: string;
  isToast!: boolean;

  results!: any[];
  options!: any[];

  isSaved!: Map<string, boolean>;
  isLoading!: Map<string, boolean>;

  constructor(private appDataService: AppDataService) {}

  ngOnInit(): void {
    this.results = [];
    this.options = [];
    this.isSaved = new Map();
    this.isLoading = new Map();
    this.isToast = false;
  }
  
  getResults(event:any){
    const val = event.target.value;
    if (val != '') {
      this.appDataService.getSearchResults(val).subscribe({
        next: (data: any) => {
          console.debug(data);
          this.results = data.results;
          this.isSaved = new Map();
          this.isLoading = new Map();
          this.options = data.results.filter((result:any) => result.media_type != 'person').map((result: any) => {
            this.isSaved.set(result.id, false);
            this.isLoading.set(result.id, false);
            return {
              title: result.media_type == 'tv'? result.name : result.title,
              id: result.id,
              mediaType: result.media_type,
              releaseYear: new Date(result.media_type == 'tv'? result.first_air_date : result.release_date).getFullYear().toString()
            };
          });
          console.debug(`MrTracker.AddEntriesComponent.ngOnInit - next line is options`)
          console.debug(this.options)
        },
        error: (error) => {
          console.error('oops');
          console.error(error);
          this.options = [];
        },
      });
    } else {
      this.options = [];
    }
  }

  handleSelection( selection:any, saveState: boolean){
    console.log(selection)
    this.isLoading.set(selection.id, true)
    this.isSaved.set(selection.id , saveState);
    if(saveState){
      this.saveEntry(selection)
    }
  }

  async saveEntry(selection: any){
    this.appDataService.saveSelection(selection)
    .subscribe({
      next: (response: StorageResponse) => {
        if(response.status){
          this.toastMessage = `${selection.title} was saved`
          this.isToast = true;
        } else {
          console.info('fail')
        }
          this.isLoading.set(selection.id, false)
      }
    })

    

  }
}
