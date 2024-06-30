import { Injectable } from '@angular/core';
import { mergeMap, switchMap} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { StorageResponse } from '../model/storage-response.model';
import { Entry } from '../model/entry.model';

const TRACKER_LIST = 'trackerList';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  isStorageReady:boolean = false;
  tmdbHeaders: HttpHeaders;

  constructor(private http: HttpClient,
              private storageService: StorageService) {

    this.storageService.storageReadyEmitter.subscribe((status: boolean) => this.isStorageReady = status)
    this.tmdbHeaders = new HttpHeaders({
      Authorization: `Bearer ${environment.accessTokenAuth}`,
      'accept': 'application/json'
    })
  }

  getSearchResults(searchCriteria: string, kind?: string){
    console.info(`mrTracker.AppDataService.getSearchResults:: Starting`)
    let url = kind? kind == 'movie'? environment.movieSearchUrl: environment.tvSearchUrl : environment.multiSearchUrl
    console.info(`mrTracker.AppDataService.getSearchResults:: finishing`)
    return this.http.get(
      url,
      {
        headers: this.tmdbHeaders,
        params: { query: searchCriteria}
      });
  }
  geTvDetailsById(selectionId: string){
    return this.http.get(
      environment.tvDetailsByIdUrl + selectionId,
      {
        headers: this.tmdbHeaders
      })
  }
  
  getMovieDetailsById(selectionId: string){
    return this.http.get(
      environment.movieDetailsByIdUrl + selectionId,
      {
        headers: this.tmdbHeaders
      })
  }

  async saveSelection(selection: any): Promise<StorageResponse>{
    console.info(`mrTracker.AppDataService.saveSelection:: Starting`)
    let details = selection.mediaType === 'tv'? this.geTvDetailsById(selection.id) : this.getMovieDetailsById(selection.id);
    let savingResponce: StorageResponse = {status: false};
    console.debug(`mrTracker.AppDataService.saveSelection:: setting details call and reponse object`)
    
    
    await this.storageService.getEntry(TRACKER_LIST).then( trackerList => {
      console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: Starting`)
      if(!trackerList.status){
        console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: failed`)
        savingResponce.errorMessage = `issue saving the tracker item, passed error message: \n\t\t\t${trackerList.errorMessage}`
        console.error(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: error message passed back from storage - \n\t\t${trackerList.errorMessage}`)
      } else { 
        console.debug('mrTracker.AppDataService.saveSelection.storageService.getEntry:: successful and passed back ->', trackerList)
        let tempList: Entry[] = trackerList.status ? trackerList.item != null ? trackerList.item : [] : [];
        console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: getting list for saving, current state is`, tempList)
        // console.debug(tempList)

        details.pipe(
          mergeMap((detail:any) => {
            console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: triggered`)
            tempList.push(
              {
                title: detail.title,
                overview: detail.overview,
                image: detail.poster_path,
                genres: detail.genres,
                apiId: detail.id,
                mediaType: selection.mediaType
              }
            )
            return this.storageService.setEntry(
              TRACKER_LIST,
              tempList
            )
          })
        )
        .subscribe(
          {
            next: (response: StorageResponse) => {
              if(response.status){
                console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: successful`)
                savingResponce.status = true;
                savingResponce.item = response.item
                console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: item saved`, response.item)
              } else {
                savingResponce.errorMessage = `issue saving the tracker item, passed error message: \n\t\t\t${response.errorMessage}`
              }
              console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: complete`)
            }
          }
        )
      }

      console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: finishing`)
    })
    console.info(`mrTracker.AppDataService.saveSelection:: finishing`)
    return savingResponce;
  }

  getTrackerList(){
    return this.isStorageReady ? this.storageService.getEntry(TRACKER_LIST) : new Promise<StorageResponse>(resolve => resolve({status: false}))
  }
}
