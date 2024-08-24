import { AppDataService } from './app-data.service';
import { StorageService } from './storage.service';
import { StorageResponse } from '../model/storage-response.model';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { CexService } from './cex.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { CexEntry } from '../model/cex-entry.model';
import { Entry } from '../model/entry.model';

describe('AppDataService', () => {

  describe('getList', () => {
    // const storageReadyEmitterMock = new EventEmitter<boolean>();

    beforeEach(() => { 
       return MockBuilder(AppDataService)
      .mock(StorageService, { 
        getEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true, item: {}})),
        init: jasmine.createSpy(),
        setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        storageReadyEmitter: new EventEmitter<boolean>()
       })
       .mock(CexService, {
        updateList: jasmine.createSpy(),
        cexListUpdateCompleteEmitter: new EventEmitter<any>()
       })
       .replace(
        HttpClientModule,
        HttpClientTestingModule
       ); 
    });

    beforeEach(() => MockInstance.remember)

    it('should call the getList method and return a storage response with status false', () => {
      
      const appDataService = MockRender(AppDataService).point.componentInstance;

      appDataService.isStorageReady = false;
      appDataService.getList('tracketrlist').then((response: StorageResponse) => {

        expect(response.status).toBeFalse();
      })

    })

    it('should call the getList method and return a storage response with status true', () => {
      
      const appDataService = MockRender(AppDataService).point.componentInstance;
      appDataService.isStorageReady = true;
      

      appDataService.getList('tracketrlist').then((response: StorageResponse) => {

        expect(response.status).toBeTrue();
      })
      
    })

    afterEach(() => MockInstance.restore);
    
  });

  describe('sessionVaild', () => {

    beforeEach(() => { 
       return MockBuilder(AppDataService)
      .mock(StorageService, {
        storageReadyEmitter: new EventEmitter<boolean>(),
      })
       .mock(CexService, {
         cexListUpdateCompleteEmitter: new EventEmitter<any>()
       })
       .replace(
        HttpClientModule,
        HttpClientTestingModule
       ); 
    });

    it('should call the sessionVaild method and return true', () => {
      
      const appDataService = MockRender(AppDataService).point.componentInstance;
      expect(appDataService.sessionValid(new Date(Date.now() - 86400000))).toBeTrue();
    }) 

    it('should call the sessionVaild method and return true', () => {
      
      const appDataService = MockRender(AppDataService).point.componentInstance;
      expect(appDataService.sessionValid(new Date(Date.now() - (86400000 * 8)))).toBeFalse();
    }) 
  })

  describe('getCexList', () => { 
    beforeEach(() => { 
      return MockBuilder(AppDataService)
      .replace(
       HttpClientModule,
       HttpClientTestingModule
      ); 
    });

    beforeEach(() => MockInstance.remember);

    it('should call the getCexList method and cexListReadyEmitter should receive a cexList with length 1, based on storage ready and getlist true', () => {
    
      MockInstance(StorageService, () => ({
        
        getEntry: jasmine.createSpy().and.returnValue(
        Promise.resolve(
          {
            status: true, 
            item: {
              expiry: new Date(), 
              cexList: [{
                description: 'test', 
                cost: 1, 
                format: 'test', 
                cexId: 'test'
              }]
            }
          }
        )
      ),
        init: jasmine.createSpy(),
        setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
        storageReadyEmitter: new EventEmitter<boolean>()
      }));

      MockInstance(CexService, () => ({
        updateList: jasmine.createSpy(),
        cexListUpdateCompleteEmitter: new EventEmitter<any>()
      }));


      const appDataService = MockRender(AppDataService).point.componentInstance;
      appDataService.isStorageReady = true;
      appDataService.getCexList()

      appDataService.cexListReadyEmitter.subscribe((cexList: CexEntry[]) => {
        expect(cexList.length).toBe(1);
      })
    })

    it('should call the getCexList method and cexListReadyEmitter should receive a cexList with length 1, based on storage ready and getlist true but session expired', () => {
    
      MockInstance(StorageService, () => ({
        
        getEntry: jasmine.createSpy().and.returnValue(
        Promise.resolve(
          {
            status: true, 
            item: {
              expiry: new Date(Date.now() - (86400000 * 8)), 
              cexList: [{
                description: 'test', 
                cost: 1, 
                format: 'test', 
                cexId: 'test'
              }]
            }
          }
        )
      ),
        init: jasmine.createSpy(),
        setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
        storageReadyEmitter: new EventEmitter<boolean>()
      }));

      MockInstance(CexService, () => ({
        updateList: jasmine.createSpy(),
        cexListUpdateCompleteEmitter: new EventEmitter<any>()
      }));


      const appDataService = MockRender(AppDataService).point.componentInstance;
      appDataService.isStorageReady = true;
      appDataService.getCexList()

      appDataService.cexListReadyEmitter.subscribe((cexList: CexEntry[]) => {
        expect(cexList.length).toBeDefined();
      })
    }) 

   it('should call the getCexList method and cexListReadyEmitter should receive a cexList with length 1 but storage is ready but getEntry returns status false', () => { 

    MockInstance(StorageService, () => ({
      
      getEntry: jasmine.createSpy().and.returnValue(
       Promise.resolve(
         {
           status: false
         }
       )
     ),
      init: jasmine.createSpy(),
      setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
      storageReadyEmitter: new EventEmitter<boolean>()
     }));

     MockInstance(CexService, () => ({
      updateList: jasmine.createSpy(),
      cexListUpdateCompleteEmitter: new EventEmitter<any>()
     }));


    const appDataService = MockRender(AppDataService).point.componentInstance;
    appDataService.isStorageReady = true;
    appDataService.getCexList()

    // appDataService.cexListReadyEmitter.subscribe((cexList: CexEntry[]) => {
    //   expect(cexList.length).toBeDefined();
    // })
   })

   afterEach(MockInstance.restore);

  });

 describe('getTrackerList', () => { 
    beforeEach(() => { 
      return MockBuilder(AppDataService)
      .replace(
       HttpClientModule,
       HttpClientTestingModule
      ); 
    });

    beforeEach(() => MockInstance.remember);  
  
    it('should call the getTrackerList method and trackerListEventEmittter should receive a trackerList with length 1', () => {

      MockInstance(StorageService, () => ({
        
        getEntry: jasmine.createSpy().and.returnValue(
        Promise.resolve(
          {
            status: true, 
            item: [
              {
                apiId: 'test',
                title: 'test',
                mediaType: 'movie',
                year: 2016,
                image: 'test'
              }
            ]
          }
        )
      ),
        init: jasmine.createSpy(),
        setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
        storageReadyEmitter: new EventEmitter<boolean>()
      }));

      MockInstance(CexService, () => ({
        updateList: jasmine.createSpy(),
        cexListUpdateCompleteEmitter: new EventEmitter<any>()
      }));

      
      const appDataService = MockRender(AppDataService).point.componentInstance;
      appDataService.isStorageReady = true;
      appDataService.getTrackerList()
      appDataService.trackerListEventEmittter.subscribe((trackerResponse: StorageResponse) => {
        expect(trackerResponse.item.length).toBe(1);
      })

    });

    it('should call the getTrackerList method and trackerListEventEmittter should receive a trackerList with length 1', () => {

      MockInstance(StorageService, () => ({
        
        getEntry: jasmine.createSpy().and.returnValue(
        Promise.resolve(
          {
            status: false, 
            message: 'test'
          }
        )
      ),
        init: jasmine.createSpy(),
        setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
        storageReadyEmitter: new EventEmitter<boolean>()
      }));

      MockInstance(CexService, () => ({
        updateList: jasmine.createSpy(),
        cexListUpdateCompleteEmitter: new EventEmitter<any>()
      }));

      
      const appDataService = MockRender(AppDataService).point.componentInstance;
      appDataService.isStorageReady = true;
      appDataService.getTrackerList()
      appDataService.trackerListEventEmittter.subscribe((trackerResponse: StorageResponse) => {
        expect(trackerResponse.item.length).toBe(0);
      })

    });

    afterEach(MockInstance.restore);
      
  })

 describe('saveSelection', () => { 
   beforeEach(() => { 
     return MockBuilder(AppDataService)
     .replace(
       HttpClientModule,
       HttpClientTestingModule
     ); 
   });
 
   beforeEach(() => MockInstance.remember);  
 
   it('should save the selection to storage', async () => {
     const selection = {
       id: 'test',
       format: ['test'],
       mediaType: 'movie'
     };
 
     const expectedEntry = {
       apiId: 'test',
       title: 'test',
       mediaType: 'movie',
       year: 2016,
       image: 'test',
       format: ['test'],
       overview: 'test',
       genres: ['test']
     };
 
     MockInstance(StorageService, () => ({
       getEntry: jasmine.createSpy().and.returnValue(
         Promise.resolve({
           status: true, 
           item: [
             {
               apiId: 'test',
               title: 'test',
               mediaType: 'movie',
               year: 2016,
               image: 'test',
               format: ['test'],
               overview: 'test',
               genres: ['test']
             }
           ]
         })
       ),
       init: jasmine.createSpy(),
       setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
       storageReadyEmitter: new EventEmitter<boolean>()
     }));
 
     MockInstance(CexService, () => ({
       updateList: jasmine.createSpy(),
       cexListUpdateCompleteEmitter: new EventEmitter<any>()
     }));
 
     const appDataService = MockRender(AppDataService).point.componentInstance;
     appDataService.isStorageReady = true;
 
     await appDataService.saveSelection(selection);
 
     appDataService.savedEventEmittter.subscribe((Response:StorageResponse) => {
       expect(Response.status).toBe(true);
       expect(Response.item).toEqual({
        name: expectedEntry.title,
        apiId: expectedEntry.apiId,
        mediaType: expectedEntry.mediaType,
        year: expectedEntry.year,
        image: expectedEntry.image,
        format: expectedEntry.format,
        overview: expectedEntry.overview,
        genres: expectedEntry.genres
      });
     })
   });
 
   afterEach(MockInstance.restore);
 });
  
 afterEach(() => MockInstance.restore());
    
})