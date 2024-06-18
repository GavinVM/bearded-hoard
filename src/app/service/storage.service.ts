import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Entry } from '../model/entry.model';
import { Storage } from '@ionic/storage-angular';
import { StorageResponse } from '../model/storage-response.model';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageResponse!: StorageResponse;
  private storage: Storage | null = null;

  constructor(private ionStorage: Storage) {
    this.init()
  }

  async init(){
    this.storageResponse = {
      status: false
    };
    const storageInitiate = await this.ionStorage.create();
    this.storage = storageInitiate;
    
  }

  async setEntry(key: string, value: any): Promise<StorageResponse>{
      try {
        console.log(`mrTracker.StorageService.setEntry:: starting`)
        console.debug(`mrTracker.StorageService.setEntry:: passed in parameters key: ${key}, value: ${value}`)
        await this.storage?.set(key, value)
        this.storageResponse.status = true;
        console.info(`mrTracker.StorageService.setEntry:: item saved for key ${key}`)
      } catch (error) {
        console.error(`mrTracker.StorageService.setEntry:: issue saving item for key ${key} `)
        this.storageResponse.status = false;
        this.storageResponse.errorMessage = 'issue setting entry in local storage';
      } finally {
        console.log(`mrTracker.StorageService.setEntry:: finishing`)
        console.log(this.storage?.get(key))
        this.storageResponse.item = value
        return this.storageResponse
      }
  }

  async getEntry(key: string){
    
    try {
      const item = await this.storage?.get(key);
      this.storageResponse.status = true;
      this.storageResponse.item = item
    } catch (error) {
      this.storageResponse.status = false;
      this.storageResponse.errorMessage = `entry for id ${key} does not exist`
    }

    return this.storageResponse;
     
  }
}
