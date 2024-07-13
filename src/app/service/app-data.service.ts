import { EventEmitter, Injectable } from '@angular/core';
import { mergeMap, Observable, of, switchMap} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { StorageResponse } from '../model/storage-response.model';
import { Entry } from '../model/entry.model';
import { CexResults } from '../model/cex-results.model';
import { CexService } from './cex.service';
import { CexEntry } from '../model/cex-entry.model';

const TRACKER_LIST = 'trackerList';
const CEX_LIST = 'cexList';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  isStorageReady:boolean = false;
  tmdbHeaders: HttpHeaders;

  savedEventEmittter: EventEmitter<StorageResponse> = new EventEmitter()
  trackerListEventEmittter: EventEmitter<Entry[]> = new EventEmitter()
  cexListReadyEmitter: EventEmitter<CexEntry[]> = new EventEmitter()

  constructor(private http: HttpClient,
              private storageService: StorageService,
              private cexService: CexService) {

    this.storageService.storageReadyEmitter.subscribe((status: boolean) => this.isStorageReady = status)
    this.cexService.cexListUpdateCompleteEmitter.subscribe(cexResults => this.cexListReadyEmitter.emit(cexResults.cexList))
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
    this.getList(TRACKER_LIST).then((response:StorageResponse) => {
      if(response.status){
        console.info(`mrTracker.AppDataService.getTrackerList:: storage ready triggering trackerList event`)
        this.trackerListEventEmittter.emit(response.item?? [])
      } else {
        if(response.errorMessage){
          console.info('mrTracker.AppDataService.getTrackerList:: list empty, triggering trackerList with empty list')
          this.trackerListEventEmittter.emit([])
        } else {
          console.info(`mrTracker.AppDataService.getTrackerList:: storage not ready, retrying in 2 seconds`)
          setTimeout(() => {
            this.getTrackerList();
          }, 2000)
        }
      }
    });
  }

  async getCexList(){
    console.info(`mrTracker.AppDataService.getCexList:: Starting`) 
    this.getList(CEX_LIST).then((storageResponse:StorageResponse) =>{
      console.info(`mrTracker.AppDataService.getCexList:: processing respose from getList() - `, storageResponse)
      if(storageResponse.status){
        console.info(`mrTracker.AppDataService.getCexList:: status is ${storageResponse.status}, getting CexResults`) 
        let cexResults: CexResults = storageResponse.item
        if(this.sessionValid(cexResults.expiry)){
          this.cexListReadyEmitter.emit(cexResults.cexList)
        } else {
          console.info(`mrTracker.AppDataService.getCexList:: session expired, updating list`)
           this.cexService.updateList()
        }
      } else {
        if(this.isStorageReady){
          console.info(`mrTracker.AppDataService.getCexList:: storage is ready updating list`)
           this.cexService.updateList()
        } else {
          console.info(`mrTracker.AppDataService.getCexList:: storage is pending, waiting 2 seconds`)
          setTimeout(() => {this.getCexList()}, 1000)
        }
      }
    });
    console.info(`mrTracker.AppDataService.getCexList:: finishing`) 
  }

  sessionValid(expiry: Date){  
    let toDate = new Date()
    
    console.log(`mrTracker.AppDataService.sessionValid:: expiry and toDate equals ${expiry == toDate}`)
    console.log(`mrTracker.AppDataService.sessionValid:: expiry and toDate local string equals ${expiry.toLocaleString() == toDate.toLocaleString()}`)
    return false;
  }

  getList(list:string){
    // handle storage not ready here instead of on the component level
    return this.isStorageReady ? this.storageService.getEntry(list) : new Promise<StorageResponse>(resolve => resolve({status: false}))
  }

  



}
