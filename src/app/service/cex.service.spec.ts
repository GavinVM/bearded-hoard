import { TestBed } from '@angular/core/testing';

import { CexService } from './cex.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { MockBuilder, MockRender, MockRenderFactory, ngMocks } from 'ng-mocks';
import { StorageResponse } from '../model/storage-response.model';
import { environment } from 'src/environments/environment';

@NgModule({
  imports:[HttpClientModule],
  providers: [StorageService, CexService]
})
class CexModule {}

describe('CexService', () => {

  beforeEach(() => {
    return MockBuilder(CexService, CexModule).replace(
      HttpClientModule,
      HttpClientTestingModule
    )
  })

  it('should create CexService', () => {
    const cexService = MockRender(CexService).point.componentInstance;

    expect(cexService).toBeDefined();
  })

  describe('transform methods', () =>{
    let cexService: any;
    beforeEach(() => {
      cexService = MockRender(CexService).point.componentInstance;
    })
    it('should retrun title from Cex boxname', () => {
      let input:string = 'Dune: Part 2 (12) 2024 4K UHD';
      let output:string = 'Dune: Part 2';
  
      // const cexService = MockRender(CexService).point.componentInstance;
  
      expect(cexService.formatBoxName(input)).toEqual(output);
    })
  
    it('should Cex boxname', () => {
      let input:string = 'Dune: Part 2';
      let output:string = 'Dune: Part 2';
  
      // const cexService = MockRender(CexService).point.componentInstance;
  
      expect(cexService.formatBoxName(input)).toEqual(output);
    })
  
    it('should return 4k from Cex categoryName', () => {
      let input:string = 'Blu-Ray 4K';
      let output:string = '4k';
  
      // const cexService = MockRender(CexService).point.componentInstance;
  
      expect(cexService.convertCexCategory(input)).toEqual(output);
    })
  
    it('should bluray from Cex categoryName', () => {
      let input:string = 'Blu-Ray Movies';
      let output:string = 'Bluray';
  
      // const cexService = MockRender(CexService).point.componentInstance;
  
      expect(cexService.convertCexCategory(input)).toEqual(output);
    })
  })

  fit('should get search results from cex', () => {
    MockRender();

    const cexService = ngMocks.findInstance(CexService);
    const httpMock = ngMocks.findInstance(HttpTestingController);

    let actual: any;

    cexService.getSearchResults().subscribe(value => (actual = value));

    const req = httpMock.expectOne(environment.cexSearchApiBase+'?page=0&hitsPerPage=10&query=Blu-Ray');
    expect(req.request.method).toEqual('GET');
    req.flush([false, true, false]);
    httpMock.verify();

    expect(actual).toEqual([false, true, false]);
  })
  // let service: CexService;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   service = TestBed.inject(CexService);
  // });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
