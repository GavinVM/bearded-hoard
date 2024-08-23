import { TestBed } from '@angular/core/testing';

import { TabsService } from './tabs.service';

describe('TabsService', () => {
  let service: TabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit passed in when triggerTabChangingEmmiter is called', () => {
    service.tabChangingEmiter.subscribe((tabname:string) => {
      expect(tabname).toEqual('testingTab');
    })

    service.triggerTabChangingEmmiter('testingTab');
  })

  it('should emit passed in when triggerTabChangingEmmiter is called', () => {
    service.tabChangedEmiter.subscribe((tabname:string) => {
      expect(tabname).toEqual('testingTab');
    })

    service.triggerTabChangedEmmiter('testingTab');
  })
});
