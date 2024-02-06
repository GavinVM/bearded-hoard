import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AppFileService {

  constructor(private http: HttpClient) { }

  public getFile(filePath:string, fileName:string){
    return this.http.get<HttpResponse<any>>(environment.fileReturnUrl, {
      params: {
        fileName: fileName,
        filePath: filePath
      }
    })
  }

  public fileSave(filePath:string, fileName: string, content: string) {
    let body = {
      fileName: fileName,
      filePath: filePath,
      content: content
    }
    return this.http.post(environment.fileSavesUrl, body)
  }
}
