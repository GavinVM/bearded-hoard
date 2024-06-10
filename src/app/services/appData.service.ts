import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Genre } from '../model/genre.model';
import { Entry } from '../model/entry.model';
import { AppFileService } from './app-file.service';
import { T } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  tmdbHeaders: HttpHeaders;
  constructor(private http: HttpClient,
              private fileService: AppFileService) {
    this.tmdbHeaders = new HttpHeaders({
      Authorization: `Bearer ${environment.accessTokenAuth}`,
      'accept': 'application/json'
    })
  }

  public getEntries() {
    return this.fileService.getFile('mainUser', 'collection.txt');
  }

  public getSearchResults(searchCriteria: string, kind?: string){
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

  public getMovieDetailsById(id: number){
    return this.http.get(
      environment.movieDetailsByIdUrl + id,
      {
        headers: this.tmdbHeaders
      })
  }

  public getMovieGenreList(){
    return this.http.get(
      environment.movieGenreListUrl,
      {
        headers: this.tmdbHeaders
      }
    )
  }

  public getTvGenreList(){
    return this.http.get(
      environment.tvGenreListUrl,
      {
        headers: this.tmdbHeaders
      }
    )
  }

  public geTvDetailsById(id: number){
    return this.http.get(
      environment.tvDetailsByIdUrl + id,
      {
        headers: this.tmdbHeaders
      })
  }
}
