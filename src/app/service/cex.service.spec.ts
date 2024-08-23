import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CexService } from './cex.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';

describe('CexService', () => {
  let service: CexService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let storageServiceMock: any;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getEntry', 'init']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CexService,
        { provide: StorageService, useValue: storageServiceMock },
      ],
    });

    service = TestBed.inject(CexService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a getSearchResults method', () => {
    expect(service.getSearchResults).toBeDefined();
  });

  it('should call the getSearchResults method and return a list of search results', () => {
    const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
    const results = [
      { id: 1, title: 'Blu-Ray 1' },
      { id: 2, title: 'Blu-Ray 2' },
    ];

    storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));

    service.getSearchResults().subscribe((response) => {
      expect(response).toEqual(results);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(results);
  });

  it('should call the getSearchResults method and return an error if the API call fails', () => {
    const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: 'Not Found',
    });
  
    storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));
  
    service.getSearchResults().subscribe(
      () => fail('should not be called'),
      (err: HttpErrorResponse) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect(err.status).toBe(404);
        expect(err.statusText).toBe('Not Found');
      }
    );
  
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('error'), error);
  });

  it('should call the getSearchResults method and return an empty list if the API call returns an empty list', () => {
    const expectedUrl = 'https://search.webuy.io/1/indexes/prod_cex_uk?page=0&hitsPerPage=10&query=Blu-Ray';
    const results:any = [];

    storageServiceMock.getEntry.and.returnValue(Promise.resolve({}));

    service.getSearchResults().subscribe((response) => {
      expect(response).toEqual(results);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(results);
  });

  it('should call the updateList method and return list of results', async() => {

  })
});