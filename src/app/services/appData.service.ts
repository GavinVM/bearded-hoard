import { Injectable } from '@angular/core';
import { ENTRIES_MOCK } from 'src/mock-data/entries-mock.data'

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  constructor() {}

  public getEntries() {
    return ENTRIES_MOCK;
  }

  public getSearchResults(kind: string, searchCriteria: string){
    let url = kind == 'movie'? MOVIEW_
  }
}
