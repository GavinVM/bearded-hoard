import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CexService } from './cex.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { MockBuilder, MockInstance, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { environment } from 'src/environments/environment';

describe('CexService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    return MockBuilder(CexService)
    .mock(StorageService, {
      getEntry: jasmine.createSpy().and.returnValue(Promise.resolve({})),
      setEntry: jasmine.createSpy().and.returnValue(Promise.resolve({})),
      init: jasmine.createSpy()
    })
    .replace(
      HttpClientModule,
      HttpClientTestingModule
    )
  });
  beforeEach(() => {
    httpMock = ngMocks.findInstance(HttpTestingController);
    MockInstance.remember});

  afterEach(() => {
    MockInstance.restore();
  });

  fit('should be created', () => {
    const service = MockRender(CexService).point.componentInstance;
    expect(service).toBeTruthy();
  });

  // it('should have a getSearchResults method', () => {
  //   expect(service.getSearchResults).toBeDefined();
  // });

  fdescribe('getSearchResults', () => {

    beforeEach(() => MockInstance.remember);

    it('should call the getSearchResults method and return an empty list if the API call returns an empty list', () => {
      const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
      const results:any = [];
      const service = MockRender(CexService); 
      const baseTMDBUrl: string = 'https://api.themoviedb.org/3/';

      MockProvider(environment, {
        production: false,
        movieSearchUrl: baseTMDBUrl + 'search/movie',
        movieDetailsByIdUrl: baseTMDBUrl + 'movie/',
        movieGenreListUrl: baseTMDBUrl + 'genre/movie/list',
        tvSearchUrl: baseTMDBUrl + 'search/tv',
        tvDetailsByIdUrl: baseTMDBUrl + 'tv/',
        tvGenreListUrl: baseTMDBUrl + 'genre/tv/list',
        multiSearchUrl: baseTMDBUrl + 'search/multi',
        accessTokenAuth:
          'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjg0NmZjNzQ0NTFhYjQ5NTZlNDYyMzY5MjY3MTJkYSIsIm5iZiI6MTcyMjYzOTc1Ni45NTQxLCJzdWIiOiI2MzRkY2VjMmVmOWQ3MjAwOTE2NGRhMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.u8eENujPod8XnSgZP-wy_xmbZbzBYOBhpPBTlIW-LcE',
        tmdbImageBase: 'https://image.tmdb.org/t/p/original',
        icons: (icon:string, outlined?:boolean | false) => {
          return `/assets/icon/${icon}${outlined ? '-outline':''}.svg`
        },
        cexSearchApiBase: 'https://search.webuy.io/1/indexes/prod_cex_uk',
        cexDefaultSearchParams: new Map<string, string>([
          ['page', '0'],
          ['hitsPerPage', '10'],
          ['query', 'Blu-Ray'],
        ])
        })

      service.point.componentInstance.getSearchResults();

      const req = httpMock.expectOne(expectedUrl);
      req.flush(results);
    });

    it('should call the getSearchResults method and request different url based on passed in searchquery', () => {
      const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=1&hitsPerPage=100&query=4k';
      const results:any = [];
      const service = MockRender(CexService); 

      const searchQuery = new Map<string, string>([
        ['searchQuery', '4k'],
        ['page', '1'],
        ['hitsPerPage', '100'],
      ])

      service.point.componentInstance.getSearchResults(searchQuery);

      const req = httpMock.expectOne(expectedUrl);
      req.flush(results);
    });

    afterEach(() => {
      MockInstance.restore()
      httpMock.verify();
    });
  });

  // it('should call the getSearchResults method and return a list of search results', () => {
  //   const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
  //   const results = [
  //     { id: 1, title: 'Blu-Ray 1' },
  //     { id: 2, title: 'Blu-Ray 2' },
  //   ];

  //   storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));

  //   service.getSearchResults().subscribe((response) => {
  //     expect(response).toEqual(results);
  //   });

  //   const req = httpMock.expectOne(expectedUrl);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(results);
  // });

  // it('should call the getSearchResults method and return an error if the API call fails', () => {
  //   const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
  //   const error = new HttpErrorResponse({
  //     status: 404,
  //     statusText: 'Not Found',
  //     error: 'Not Found',
  //   });
  
  //   storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));
  
  //   service.getSearchResults().subscribe(
  //     () => fail('should not be called'),
  //     (err: HttpErrorResponse) => {
  //       expect(err).toBeInstanceOf(HttpErrorResponse);
  //       expect(err.status).toBe(404);
  //       expect(err.statusText).toBe('Not Found');
  //     }
  //   );
  
  //   const req = httpMock.expectOne(expectedUrl);
  //   expect(req.request.method).toBe('GET');
  //   req.error(new ErrorEvent('error'), error);
  // });

  // it('should call the getSearchResults method and return an empty list if the API call returns an empty list', () => {
  //   const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
  //   const results:any = [];

  //   storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));

  //   service.getSearchResults().subscribe((response) => {
  //     expect(response).toEqual(results);
  //   });

  //   const req = httpMock.expectOne(expectedUrl);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(results);
  // });
});