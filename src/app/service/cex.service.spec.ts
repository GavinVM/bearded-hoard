import { TestBed } from '@angular/core/testing';

import { CexService } from './cex.service';

describe('CexService', () => {
  let service: CexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
