import { EventEmitter, Injectable } from '@angular/core';
import { mergeMap, of, switchMap} from 'rxjs';
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

  savedEventEmittter: EventEmitter<StorageResponse> = new EventEmitter()

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
  geTvDetailsById(selectionId: string, mediaType?: string, apiSearchResults?: any){
    // console.info('mrTracker.AppDataService.getSearchResults:: passed param - ',selectionId, mediaType, apiSearchResults )
    return mediaType == 'movie' ? of(apiSearchResults) : this.http.get(
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

  saveSelection(selection: any){
    console.info(`mrTracker.AppDataService.saveSelection:: Starting`)
    let details = selection.mediaType === 'tv'? this.geTvDetailsById(selection.id) : this.getMovieDetailsById(selection.id);
    let savingResponce: StorageResponse = {status: false};
    console.debug(`mrTracker.AppDataService.saveSelection:: setting details call and reponse object`)
    
    
    this.storageService.getEntry(TRACKER_LIST).then( trackerList => {
      console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: Starting`)
      if(!trackerList.status && !trackerList.errorMessage?.includes("empty")){
        console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: failed`)
        savingResponce.errorMessage = `issue saving the tracker item, passed error message: \n\t\t\t${trackerList.errorMessage}`
        console.error(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: error message passed back from storage - \n\t\t${trackerList.errorMessage}`)
      } else { 
        console.debug('mrTracker.AppDataService.saveSelection.storageService.getEntry:: successful and passed back ->', trackerList)
        let tempList: Entry[] = trackerList.status ? trackerList.item != null ? trackerList.item : [] : [];
        console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: getting list for saving, current state is`, tempList)
        let updateEntry: Entry;
        let isUpdate: boolean = false;
        let updateIndex: number;

        if(tempList.length > 0){
          let tempEntry = tempList.filter((entry: Entry, index: number) => {
            if(entry.apiId == selection.id){
              updateIndex = index;
              return true
            } else {
              return false
            }
          })
          if(tempEntry.length > 0){
            updateEntry = tempEntry[0];
            updateEntry.format.push(selection.format)
            isUpdate = true;
          }
        }

        details.pipe(
          mergeMap((detail:any) => {
            console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: triggered`)
            if(isUpdate){
              tempList[updateIndex] = updateEntry
            } else {
              tempList.push(
                {
                  title:  selection.mediaType === 'tv'? detail.name : detail.title,
                  overview: detail.overview,
                  image: detail.poster_path,
                  genres: detail.genres,
                  apiId: detail.id,
                  mediaType: selection.mediaType,
                  format: [selection.format],
                  season: selection.season
                }
              )
            }
            console.debug(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: list updated`, tempList)
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
                savingResponce.item = isUpdate ? updateEntry : tempList[tempList.length-1]
                console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: item saved`, response.item)
              } else {
                savingResponce.errorMessage = `issue saving the tracker item, passed error message: \n\t\t\t${response.errorMessage}`
              }
              console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry.setEntry:: complete`)
              this.savedEventEmittter.emit(savingResponce);
            }
          }
        )
      }
      console.info(`mrTracker.AppDataService.saveSelection.storageService.getEntry:: finishing`)
      
      
    })
    
  }

  updateTrackerList(tracketList: Entry[]): Promise<StorageResponse>{
    return this.storageService.setEntry(TRACKER_LIST, tracketList)
  }

  getTrackerList(){
    return this.isStorageReady ? this.storageService.getEntry(TRACKER_LIST) : new Promise<StorageResponse>(resolve => resolve({status: false}))
  }
}
