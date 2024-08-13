import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';

import { AddPage } from './add.page';
import { AddPageModule } from './add.module';
import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';
import { AppDataService } from '../service/app-data.service';
import { EventEmitter } from '@angular/core';
import { TabsService } from '../service/tabs.service';
import { of } from 'rxjs';

fdescribe('AddPage', () => {
  beforeEach( () => MockBuilder(AddPage, AddPageModule));

  beforeEach(() => MockInstance.remember);

  it('should create', () => {

    MockInstance(AppDataService, () => ({
      getTrackerList: jasmine.createSpy(),
      trackerListEventEmittter: new EventEmitter<any>(),
      savedEventEmittter: new EventEmitter<any>()
    }));

    MockInstance(TabsService, () => ({
      tabChangingEmiter: new EventEmitter<any>()
    }))

    MockInstance(ToastController, () => ({
      create: jasmine.createSpy().and.returnValue(Promise.resolve({})),
      present: jasmine.createSpy()
    }))

    const component = MockRender(AddPage).point.componentInstance;
    expect(component).toBeTruthy();
  });

  afterEach(MockInstance.restore);

  describe('setOnlineOfflineStatus', () => {

    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>()
      }));
  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        present: jasmine.createSpy()
      }))
    
    })

    beforeEach(() => MockInstance.remember);

    it('should set online', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      component.point.componentInstance.isOnline = false;
      const setOnlineOfflineStatusSpy = spyOn(component.point.componentInstance, 'setOnlineOfflineStatus');
      
      window.dispatchEvent(new Event('online'));

      
      expect(setOnlineOfflineStatusSpy).toHaveBeenCalledWith(true);
    })

    it('should set offline', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      component.point.componentInstance.isOnline = false;
      const setOnlineOfflineStatusSpy = spyOn(component.point.componentInstance, 'setOnlineOfflineStatus');
      
      window.dispatchEvent(new Event('offline'));

      
      expect(setOnlineOfflineStatusSpy).toHaveBeenCalledWith(false);
    })

    afterEach(MockInstance.restore);

  });

  describe('tabChange', () => {

    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>()
      }));
  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        present: jasmine.createSpy()
      }))
    
    })

    beforeEach(() => MockInstance.remember);

    it('should setup tab for fresh search', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      component.point.componentInstance.options = ['test']
      component.point.componentInstance.searchbarTextBox.value = 'test';
      
      
      component.point.componentInstance.tabChange('other');
      expect(component.point.componentInstance.options.length).toBe(0);
      expect(component.point.componentInstance.searchbarTextBox.value).toBe('');
    })

    it('should do nothing', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      component.point.componentInstance.options = ['test']
      component.point.componentInstance.searchbarTextBox.value = 'test';
      
      
      component.point.componentInstance.tabChange('add');
      expect(component.point.componentInstance.options.length).toBe(1);
      expect(component.point.componentInstance.searchbarTextBox.value).toBe('test');
    })

    it('should tabChange called from event', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      
      const tabServiceMock = component.point.injector.get(TabsService);
      const tabChangeSpy = spyOn(component.point.componentInstance, 'tabChange');
      
      
      tabServiceMock.tabChangingEmiter.emit('test');
      expect(tabChangeSpy).toHaveBeenCalledWith('test');
    })

    it('should call app data service getTrackList when tab name is add', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      
      const tabServiceMock = component.point.injector.get(TabsService);
      const appDataServiceMock = component.point.injector.get(AppDataService);
      const tabChangeSpy = spyOn(component.point.componentInstance, 'tabChange');
      
      
      tabServiceMock.tabChangingEmiter.emit('add');
      expect(appDataServiceMock.getTrackerList).toHaveBeenCalled();
    })

    afterEach(MockInstance.restore);

  });

  describe('getResults', () => {

    beforeEach(() => {  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        present: jasmine.createSpy()
      }))
    
    })

    beforeEach(() => MockInstance.remember);

    it('should set results', () => {

      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>(),
        getSearchResults: jasmine.createSpy().and.returnValue(of({results: [
          {
            id: '1',
            media_type: 'movie',
          }
        ]})),
        geTvDetailsById: jasmine.createSpy().and.returnValue(of({
          title: 'test',
          id: '1',
          media_type: 'movie',
          release_date: '1999-10-15',
        }))
      }));

      const component = MockRender(AddPage);
      component.detectChanges();
      const optionsExample = {
        id: 1,
        title: 'test',
        mediaType: 'movie',
        releaseDate: '1999'
      }
      
      const AppDataServiceMock = component.point.injector.get(AppDataService);

      const eventMock = {
        target: {
          value: 'test'
        }
      }
      
      component.point.componentInstance.getResults(eventMock);
      expect(AppDataServiceMock.getSearchResults).toHaveBeenCalledWith('test');
      expect(AppDataServiceMock.geTvDetailsById).toHaveBeenCalledWith('1', 'movie', {id: '1',
        media_type: 'movie'});
      
    })

    it('should do nothing', () => {

      const component = MockRender(AddPage);
      component.detectChanges();
      component.point.componentInstance.options = ['test']
      component.point.componentInstance.searchbarTextBox.value = 'test';
      
      
      component.point.componentInstance.tabChange('add');
      expect(component.point.componentInstance.options.length).toBe(1);
      expect(component.point.componentInstance.searchbarTextBox.value).toBe('test');
    })

    afterEach(MockInstance.restore);

  });

  fdescribe('formatResultsForTvSeasons', () => {

    beforeEach(() => {  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        present: jasmine.createSpy()
      }))

      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>(),
      }));
    
    })

    beforeEach(() => MockInstance.remember);

    it('should return array of details from input', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const inputExample = {
        id: 1,
        name: 'test',
        seasons: {
          name: 'season-1',
          air_date: '2010-12-05'
        }
      }

      const outputExample = [
        {
          title: 'test',
          season: 'season-1',
          id: 1,
          mediaType: 'tv', 
          releaseYear: '2010'
        },
        {
          title: 'test',
          season: 'box-set',
          id: 1,
          mediaType: 'tv', 
          releaseYear: '2010'
        }
      ]
      
      expect(component.point.componentInstance.formatResultsForTvSeasons(inputExample)).toEqual(outputExample);
      
    })

    afterEach(MockInstance.restore);

  });

});
