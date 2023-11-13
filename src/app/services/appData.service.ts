import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ENTRIES_MOCK } from 'src/mock-data/entries-mock.data'

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  constructor(private http: HttpClient) {}

  public getEntries() {
    return this.http.get(environment.entriesurl)
  }

  public getSearchResults(searchCriteria: string, kind?: string){
    let url = kind? kind == 'movie'? environment.movieSearchUrl: environment.tvSearchUrl : environment.multiSearchUrl

    
  }
}
