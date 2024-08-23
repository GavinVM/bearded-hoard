import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, MenuController } from '@ionic/angular';

import { CexIntergrationComponent } from './cex-intergration.component';
import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';
import { EventEmitter } from '@angular/core';
import { AppDataService } from '../service/app-data.service';
import { CexIntergrationModule } from './cex-intergration.module';
import { of } from 'rxjs';
import { CexEntry } from '../model/cex-entry.model';

describe('CexIntergrationComponent', () => {
  
  beforeEach( () =>  MockBuilder(CexIntergrationComponent, CexIntergrationModule));

  beforeEach(() => {
    MockInstance(AppDataService, () => ({
      getCexList: jasmine.createSpy(),
      cexListReadyEmitter: new EventEmitter<any>()
    }))

    MockInstance(MenuController, () => ({
      open: jasmine.createSpy().and.returnValue(Promise.resolve({})),
      close: jasmine.createSpy().and.returnValue(Promise.resolve({})),
    }))
  });

  beforeEach(() => MockInstance.remember);

  it('should create', () => {

    const component = MockRender(CexIntergrationComponent).point.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('handleCexList', () => {

    beforeEach(() => MockInstance.remember);

    it('should set cexList', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      const cexList = component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'b test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'test', 
        cost: 3, 
        format: 'test', 
        cexId: 'test'
      }];;
      
      component.cexList = [];

      component.handleCexList(cexList);
      expect(component.cexList.length).toEqual(4);
      expect(component.originalCexlist.length).toEqual(4);
      expect(component.isloading).toBeFalse();
      expect(component.isNoResults).toBeFalse();
    })

    it('should not set cexList', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      const cexList: CexEntry[] = [];

        
      component.cexList = [];

      component.handleCexList(cexList);
      expect(component.cexList.length).toEqual(0);
      expect(component.originalCexlist.length).toEqual(0);
      expect(component.isNoResults).toBeTrue();
    })

    it('should be called on cexListReadyEmitter event', () => {
      const component = MockRender(CexIntergrationComponent);

      const handleCexListSpy = spyOn(component.point.componentInstance, 'handleCexList');
      const appDataService = component.point.injector.get(AppDataService);

      appDataService.cexListReadyEmitter.emit([]);
      expect(handleCexListSpy).toHaveBeenCalled();
    })
    afterEach(() => MockInstance.restore);
  })

  describe('revealFilterMenu & closeFilterMenu', () => {

    beforeEach(() => MockInstance.remember);

    it('should open menu, filtersMenu', () => {
      const component = MockRender(CexIntergrationComponent);

      const menuControllerSpy = component.point.injector.get(MenuController);

      component.point.componentInstance.revealFilterMenu();
      expect(menuControllerSpy.open).toHaveBeenCalledWith('filtersMenu');
    })

    it('should close menu, filtersMenu', () => {
      const component = MockRender(CexIntergrationComponent);

      const menuControllerSpy = component.point.injector.get(MenuController);

      component.point.componentInstance.closeFilterMenu();
      expect(menuControllerSpy.close).toHaveBeenCalledWith('filtersMenu');
    })

    afterEach(() => MockInstance.restore);
  })

  describe('reorderList', () => {

    beforeEach(() => MockInstance.remember);

    it('should sort a to z', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'b test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'test', 
        cost: 3, 
        format: 'test', 
        cexId: 'test'
      }];

      component.reorderList({
        detail:{
          value: 'az'
        },
        srcElement: {
          selectedText: 'az'
        }});

      expect(component.cexList[0].description).toEqual('a test');
    })

    it('should sort z to a', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'b test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.reorderList({
        detail:{
          value: 'za'
        },
        srcElement: {
          selectedText: 'za'
        }});
        
      expect(component.cexList[0].description).toEqual('test');
    })

    it('should sort low to high', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 3, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.reorderList({
        detail:{
          value: 'lh'
        },
        srcElement: {
          selectedText: 'lh'
        }});
        
      expect(component.cexList[0].description).toEqual('test');
    })


    it('should sort high to low', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 3, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'b test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'c test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.reorderList({
        detail:{
          value: 'hl'
        },
        srcElement: {
          selectedText: 'hl'
        }});
        
      expect(component.cexList[0].description).toEqual('a test');
    })

    it('should not sort', () => {
      const component = MockRender(CexIntergrationComponent).point.componentInstance;
      component.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.reorderList({
        detail:{
          value: 'other'
        },
        srcElement: {
          selectedText: 'hl'
        }});

        const sortSpy = spyOn(component.cexList, 'sort').and.callThrough();
        
      expect(component.cexList[0].description).toEqual('test');
      expect(sortSpy).not.toHaveBeenCalled();
    })


    afterEach(() => MockInstance.restore);
  })

  describe('priceRangeFilter', () => {

    beforeEach(() => MockInstance.remember);

    it('should set min price', () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 1
        },
        srcElement: {
          name: 'min'
        }
      }

      component.point.componentInstance.priceRangeFilter(eventMock);
      expect(component.point.componentInstance.minPrice).toEqual(1);
      expect(component.point.componentInstance.priceRangeTimeoutList.length).toEqual(1);
    })

    it('should set max price', () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 1
        },
        srcElement: {
          name: 'max'
        }
      }

      component.point.componentInstance.priceRangeFilter(eventMock);
      expect(component.point.componentInstance.maxPrice).toEqual(1);
      expect(component.point.componentInstance.priceRangeTimeoutList.length).toEqual(1);
    })

    it('should set max 0 on empty input', () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: ''
        },
        srcElement: {
          name: 'max'
        }
      }

      component.point.componentInstance.priceRangeFilter(eventMock);
      expect(component.point.componentInstance.maxPrice).toEqual(0);
    })

    it('should set min 0 on empty input', () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: ''
        },
        srcElement: {
          name: 'min'
        }
      }

      component.point.componentInstance.priceRangeFilter(eventMock);
      expect(component.point.componentInstance.maxPrice).toEqual(0);
    })

    it('should should filter some entries, max price in mid range', async () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 1
        },
        srcElement: {
          name: 'max'
        }
      }

      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.point.componentInstance.priceRangeFilter(eventMock);
      setTimeout(() => {
        expect(component.point.componentInstance.cexList.length).toEqual(1);
      }, 2500)
    })

    it('should should filter some entries, min price in mid range', async () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 2
        },
        srcElement: {
          name: 'min'
        }
      }

      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.point.componentInstance.priceRangeFilter(eventMock);
      setTimeout(() => {
        expect(component.point.componentInstance.cexList.length).toEqual(1);
      }, 2500)
    })

    it('should should filter all entries, min value is higher than all', async () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 3
        },
        srcElement: {
          name: 'min'
        }
      }

      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.point.componentInstance.priceRangeFilter(eventMock);
      setTimeout(() => {
        expect(component.point.componentInstance.cexList.length).toEqual(0);
      }, 2500)
    })

    it('should should filter no entries, max value is higher than all', async () => {
      const component = MockRender(CexIntergrationComponent);

      const eventMock = {
        detail:{
          value: 3
        },
        srcElement: {
          name: 'max'
        }
      }

      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'test', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: 'test', 
        cexId: 'test'
      }];

      component.point.componentInstance.priceRangeFilter(eventMock);
      setTimeout(() => {
        expect(component.point.componentInstance.cexList.length).toEqual(2);
      }, 2500)
    })

    afterEach(() => MockInstance.restore);
  })

  describe('formatFilter', () => {

    beforeEach(() => MockInstance.remember);

    it('should only include entries with the passed in format, bluray(bl)', () => {
      const component = MockRender(CexIntergrationComponent);
      
      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'Bluray', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: '4k', 
        cexId: 'test'
      }];

      const eventMock = {
        detail:{
          value: 'bl'
        }
      }

      component.point.componentInstance.formatFilter(eventMock);

      expect(component.point.componentInstance.cexList.length).toEqual(1); 
      expect(component.point.componentInstance.previousUnfilteredList.length).toEqual(2);
      
    })

    it('should only include entries with the passed in format, 4k(4k)', () => {
      const component = MockRender(CexIntergrationComponent);
      
      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'Bluray', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: '4k', 
        cexId: 'test'
      }];

      const eventMock = {
        detail:{
          value: '4k'
        }
      }

      component.point.componentInstance.formatFilter(eventMock);

      expect(component.point.componentInstance.cexList.length).toEqual(1); 
      expect(component.point.componentInstance.previousUnfilteredList.length).toEqual(2);
      
    })

    it('shouldinclude all entries with no passed in format', () => {
      const component = MockRender(CexIntergrationComponent);
      
      component.point.componentInstance.cexList = [{
        description: 'test', 
        cost: 1, 
        format: 'Bluray', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: '4k', 
        cexId: 'test'
      }];

      const eventMock = {
        detail:{
          value: ''
        }
      }

      component.point.componentInstance.formatFilter(eventMock);

      expect(component.point.componentInstance.cexList.length).toEqual(2); 
      expect(component.point.componentInstance.previousUnfilteredList.length).toEqual(0);
      
    })

    afterEach(() => MockInstance.restore);
  })
  
  describe('clearFilters', () => {

    beforeEach(() => MockInstance.remember);

    it('should reset the cexList to original cexList', () => {
      const component = MockRender(CexIntergrationComponent);

      const setFilterSpy = spyOn(component.point.componentInstance, 'setFilterDefaults');

      const cexListMock = [{
        description: 'test', 
        cost: 1, 
        format: 'Bluray', 
        cexId: 'test'
      },
      {
        description: 'a test', 
        cost: 2, 
        format: '4k', 
        cexId: 'test'
      }];

      component.point.componentInstance.cexList = [];
      component.point.componentInstance.originalCexlist = cexListMock;

      component.point.componentInstance.clearFilters();
      expect(component.point.componentInstance.cexList).toEqual(cexListMock);
      expect(setFilterSpy).toHaveBeenCalled();
    })

    afterEach(() => MockInstance.restore);
  })

  afterEach(() => MockInstance.restore);
});
