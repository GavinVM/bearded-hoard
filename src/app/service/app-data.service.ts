import { EventEmitter, Injectable } from '@angular/core';
import { mergeMap, Observable, of} from 'rxjs';
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
const EXPIRY_DURATION = 604800000;
const RETRY_LIMIT: number = 10;

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  isStorageReady:boolean = false;
  tmdbHeaders: HttpHeaders;
  retryCount: Map<string, number> = new Map();
  setTimeoutId: Map<string, any> = new Map();

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

  getSearchResults(searchCriteria: string, kind?: string): Observable<any>{
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
  geTvDetailsById(selectionId: string, mediaType?: string, apiSearchResults?: any): Observable<any>{
    // console.info('mrTracker.AppDataService.getSearchResults:: passed param - ',selectionId, mediaType, apiSearchResults )
    return mediaType == 'movie' ? of(apiSearchResults) : this.http.get(
      environment.tvDetailsByIdUrl + selectionId,
      {
        headers: this.tmdbHeaders
      })
  }
  
  getMovieDetailsById(selectionId: string): Observable<any>{
    return this.http.get(
      environment.movieDetailsByIdUrl + selectionId,
      {
        headers: this.tmdbHeaders
      })
  }

  saveSelection(selection: any): void{
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

  getTrackerList(): void{
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
          if(this.handleRetryCount('getTrackerList', () => this.getTrackerList(), 1000)){
            console.info(`mrTracker.AppDataService.getTrackerList:: retrying in 2 seconds`)
          } else {
            console.error(`mrTracker.AppDataService.getTrackerList:: storage initialization timeout`)
            return
          }
        }
      }
    });
  }

  handleRetryCount(method: string, retryFunction: () => void, duration: number = 1000): boolean {
    if (this.retryCount.has(method)) {
      if ((this.retryCount.get(method) ?? 0) > RETRY_LIMIT) {
        console.info(`mrTracker.AppDataService.handleRetryCount:: ${method} retry limit reached`)
        clearTimeout(this.setTimeoutId.get(method))
        this.retryCount.set(method, 0)
        this.setTimeoutId.clear()
        console.error(`mrTracker.AppDataService.handleRetryCount:: ${method} timeout reached`)
        console.error(`mrTracker.AppDataService.handleRetryCount:: ${method} storage initialization timeout`)
        return true
      } else {
        console.info(`mrTracker.AppDataService.handleRetryCount:: ${method} retry count is ${this.retryCount.get(method)}`)
        this.retryCount.set(method, (this.retryCount.get(method) ?? 0) + 1)
      }
    } else {
      console.info(`mrTracker.AppDataService.handleRetryCount:: ${method} retry count is 1`)  
      this.retryCount.set(method, 1)
    }
    let timer = setTimeout(() => {
      console.info(`mrTracker.AppDataService.handleRetryCount:: ${method} ${(duration/1000)} second(s) timeout triggered`) 
      retryFunction()
    }, duration)
    this.setTimeoutId.set(method, timer)
    return true;
  }

  getCexList(): void{
    console.info(`mrTracker.AppDataService.getCexList:: Starting`) 
    this.getList(CEX_LIST).then((storageResponse:StorageResponse) =>{
      console.debug(`mrTracker.AppDataService.getCexList:: processing respose from getList() - `, storageResponse)
      if(storageResponse.status){
        console.debug(`mrTracker.AppDataService.getCexList:: status is ${storageResponse.status}, getting CexResults`) 
        let cexResults: CexResults = storageResponse.item
        if(this.sessionValid(cexResults.expiry)){
          console.info(`mrTracker.AppDataService.getCexList:: session is valid`)
          console.debug(`mrTracker.AppDataService.getCexList:: emitting cexList`, cexResults.cexList)
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
          console.info(`mrTracker.AppDataService.getCexList:: storage is pending, waiting 1 seconds`)
          if(this.handleRetryCount('getCexList', () => this.getCexList(), 2000)){
            console.info(`mrTracker.AppDataService.getCexList:: retrying...`)
          } else {
            console.error(`mrTracker.AppDataService.getCexList:: storage initialization timeout`)
            return
          }
        }
      }
    });    
  }

  sessionValid(expiry: Date): boolean{
    console.log(`mrTracker.AppDataService.sessionValid:: validating session`)
    console.debug(`mrTracker.AppDataService.sessionValid:: expected difference is ${EXPIRY_DURATION} but got ${(Date.parse(new Date().toISOString()) - Date.parse(expiry.toISOString()))}`)
    console.debug(`mrTracker.AppDataService.sessionValid:: dates before parse are `, expiry,new Date())
    console.debug(`mrTracker.AppDataService.sessionValid:: restult was ${(Date.parse(new Date().toISOString()) - Date.parse(expiry.toISOString())) < EXPIRY_DURATION}`)
    return (Date.parse(new Date().toISOString()) - Date.parse(expiry.toISOString())) < EXPIRY_DURATION;
  }

  getList(list:string){
    console.info(`mrTracker.AppDataService.getList:: starting`)
    console.info(`mrTracker.AppDataService.getList:: getting list ${list}`)
    return this.isStorageReady ? this.storageService.getEntry(list) : new Promise<StorageResponse>(resolve => resolve({status: false}))
  }

  



}
