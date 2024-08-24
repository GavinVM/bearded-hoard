import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StorageResponse } from '../model/storage-response.model';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageResponse!: StorageResponse;

  storageReadyEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private ionStorage: Storage) {
    this.init()
  }

  async init(){
    console.log(`mrTracker.StorageService.init:: starting`)
    this.storageResponse = {
      status: false
    };
    await this.ionStorage.create();
    this.storageReadyEmitter.emit(true)
    console.log(`mrTracker.StorageService.init:: empty storage set `, this.ionStorage)
    console.log(`mrTracker.StorageService.init:: finishing`)    
  }

  async setEntry(key: string, value: any): Promise<StorageResponse>{
      try {
        console.log(`mrTracker.StorageService.setEntry:: starting`)
        console.debug(`mrTracker.StorageService.setEntry:: passed in parameters key: ${key}, value: `, value)
        await this.ionStorage.set(key, value)
        this.storageResponse.status = true;
        console.info(`mrTracker.StorageService.setEntry:: item saved for key ${key}`)
      } catch (error) {
        console.error(`mrTracker.StorageService.setEntry:: issue saving item for key ${key} `)
        this.storageResponse.status = false;
        this.storageResponse.errorMessage = 'issue setting entry in local storage';
      } finally {
        console.log(`mrTracker.StorageService.setEntry:: finishing`)
        console.log(this.ionStorage.get(key))
        this.storageResponse.item = value
        return this.storageResponse
      }
  }

  async getEntry(key: string){
    
    try {
      console.log(`mrTracker.StorageService.getEntry:: starting`)
      console.debug(`mrTracker.StorageService.getEntry:: passed in parameters key: ${key}`)
      let length = await this.ionStorage.length()
      console.debug(`mrTracker.StorageService.getEntry:: storage lenth is ${length}`)
      if(length == 0){
        this.storageResponse.errorMessage = 'empty'
      } else {
        let keys = await this.ionStorage.keys();
        if(!keys.includes(key)) throw 'key not found'
        let item = await this.ionStorage.get(key);
        
        this.storageResponse.status = true;
        this.storageResponse.item = item
        console.debug(`mrTracker.StorageService.getEntry:: got entry for ${key}`, item)
      }
      
    } catch (error) {
      console.error(`mrTracker.StorageService.getEntry:: issue getting item for key ${key}, `, error)
      this.storageResponse.status = false;
      this.storageResponse.errorMessage = `issue for ${key}, error message: \n\t\t\t${error}`
    }
    console.log(`mrTracker.StorageService.getEntry:: finishing`)
    return this.storageResponse;
     
  }
}
