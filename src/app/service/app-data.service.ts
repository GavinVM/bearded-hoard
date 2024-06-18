import { Injectable } from '@angular/core';
import { switchMap} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { StorageResponse } from '../model/storage-response.model';

const TRACKER_LIST = 'trackerList';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  tmdbHeaders: HttpHeaders;
  constructor(private http: HttpClient,
              private storageService: StorageService) {
    this.tmdbHeaders = new HttpHeaders({
      Authorization: `Bearer ${environment.accessTokenAuth}`,
      'accept': 'application/json'
    })
  }

  getSearchResults(searchCriteria: string, kind?: string){
    console.info(`AppDataService.getSearchResults:: Starting`)
    let url = kind? kind == 'movie'? environment.movieSearchUrl: environment.tvSearchUrl : environment.multiSearchUrl
    console.info(`AppDataService.getSearchResults:: finishing`)
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

  saveSelection(selection: any){
    let details = selection.mediaType === 'tv'? this.geTvDetailsById(selection.id) : this.getMovieDetailsById(selection.id);
    let tempStatus = false;
    
    return details.pipe(
      switchMap((detail:any) => this.storageService.setEntry(
        TRACKER_LIST,
        {
          title: detail.title,
          overview: detail.overview,
          image: detail.poster_path,
          genres: detail.genres,
          apiId: detail.id,
          mediaType: selection.mediaType
        }
      )
      )
    )
  }
}
