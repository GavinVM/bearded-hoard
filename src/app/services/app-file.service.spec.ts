import { TestBed } from '@angular/core/testing';

import { AppFileService } from './app-file.service';

describe('AppFileService', () => {
  let service: AppFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
