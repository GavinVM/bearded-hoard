import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CexEntry } from '../model/cex-entry.model';
import { map, mergeMap, of } from 'rxjs';
import { StorageService } from './storage.service';
import { CexResults } from '../model/cex-results.model';
import { StorageResponse } from '../model/storage-response.model';
import { Entry } from '../model/entry.model';

@Injectable({
  providedIn: 'root'
})
export class CexService {

  cexList!: CexEntry[];
  cexResults!: CexResults;
  existingTitles!: string[];

  constructor(private http: HttpClient,
              private storageService: StorageService) { }

  async updateList(){
    console.info(`mrTracker.CexService.updateList:: Starting`)
    this.cexList = [];
    this.cexResults = {
      cexList: this.cexList,
      expiry: new Date()
    }
    console.debug(`mrTracker.CexService.updateList:: waiting for existing list`)
    await this.storageService.getEntry('trackerList').then((response: StorageResponse) => {
      if(response.status){
        this.existingTitles = response.item.map((entry: Entry) => entry.title);
      }
    })
    console.debug(`mrTracker.CexService.updateList:: got list`)

    return this.getSearchResults().pipe(
      mergeMap((results:any) => {
        let pageNumbers = Array.from(Array(results.nbPages).keys()) 
        let urlPrams = environment.cexDefaultSearchParams;
        return Promise.all(
          pageNumbers.map(async (page: number) => {
            urlPrams.set('page', (page+1).toString());
            this.getSearchResults(urlPrams).pipe(
              map((results:any) => {
                results
                .filter((hit:any) => !this.existingTitles.includes(hit.bixName.subString(0, hit.boxName.indexOf('('))))
                .filter((hit:any) => hit.availability.includes("In Stock Online"))
                .filter((hit:any) => hit.sellPrice < 4)
              })
            )
          })
        ).then((collectiveResults:any) => {
          collectiveResults.forEach((hit:any) => {
            this.cexList.push({
              cexId: hit.boxId,
              cost: hit.sellPrice,
              description: hit.boxName,
              format: this.convertFormat(hit.categoryFriendlyName)
            })
          })
  
          this.cexResults.cexList = this.cexList
  
          return this.storageService.setEntry('cexList', this.cexResults);
        })
      })
    )
      

  }

  getSearchResults(searchQuery?: Map<string,string>){
    let cexDefaultSearchParams: Map<string,string> = environment.cexDefaultSearchParams
    let urlPrams: HttpParams = new HttpParams();
    if(searchQuery != undefined)  cexDefaultSearchParams = searchQuery;

    cexDefaultSearchParams.forEach((name:string, value:string) => {
      urlPrams.set(name, value);
    });

    return this.http.get(environment.cexSearchApiBase, {params: urlPrams});
    
  }

  convertFormat(cexCategory:string):string{
    
    return cexCategory.includes('4k') ? '4k' : 'bluray';
  }


}
