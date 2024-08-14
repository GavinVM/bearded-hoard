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

  describe('formatResultsForTvSeasons', () => {

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

  describe('handleSelection', () => {

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
        saveSelection: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>(),
      }));
    
    })

    beforeEach(() => MockInstance.remember);

    it('should update loading and saved state for 4k, when saveState is true', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();

      const selection = {
        id: '1',
        name: 'test',
        formate: ''
      }

      const AppDataServiceMock = component.point.injector.get(AppDataService);

      component.point.componentInstance.handleSelection(selection, true, '4k');
      
      expect(AppDataServiceMock.saveSelection).toHaveBeenCalledWith(selection);
      expect(component.point.componentInstance.isLoading4k.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isSaved4k.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isLoadingBluray.size).toEqual(0);
      expect(component.point.componentInstance.isSavedBluray.size).toEqual(0);
      expect(component.point.componentInstance.currentFormat).toEqual('4k');
      
    })

    it('should update loading and saved state for bluray, when saveState is true', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();

      const selection = {
        id: '1',
        name: 'test',
        formate: ''
      }

      const AppDataServiceMock = component.point.injector.get(AppDataService);

      component.point.componentInstance.handleSelection(selection, true, 'bluray');
      
      expect(AppDataServiceMock.saveSelection).toHaveBeenCalledWith(selection);
      expect(component.point.componentInstance.isLoadingBluray.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isSavedBluray.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isLoading4k.size).toEqual(0);
      expect(component.point.componentInstance.isSaved4k.size).toEqual(0);
      expect(component.point.componentInstance.currentFormat).toEqual('bluray');
      
    })

    it('should update loading and saved state for 4k, when saveState is false', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();

      const selection = {
        id: '1',
        name: 'test',
        formate: ''
      }

      component.point.componentInstance.currentTrackerList = [
        {
          title: 'test',
          season: 'box-set',
          apiId: '1',
          mediaType: 'tv', 
          format: ['4k'],
          genres: [],
          image: '',
          overview: '',
        }
      ]

      const AppDataServiceMock = component.point.injector.get(AppDataService);
      const toastSpy = spyOn(component.point.componentInstance, 'createToast');

      component.point.componentInstance.handleSelection(selection, false, '4k');
      
      expect(AppDataServiceMock.saveSelection).not.toHaveBeenCalled();
      expect(component.point.componentInstance.isLoading4k.get(selection.id)).toBeFalse();
      expect(component.point.componentInstance.isSaved4k.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isLoadingBluray.size).toEqual(0);
      expect(component.point.componentInstance.isSavedBluray.size).toEqual(0);
      expect(toastSpy).toHaveBeenCalledWith('Entry Already Exists', 'warning');
      
    })

    it('should update loading and saved state for bluray, when saveState is false', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();

      const selection = {
        id: '1',
        name: 'test',
        formate: ''
      }

      component.point.componentInstance.currentTrackerList = [
        {
          title: 'test',
          season: 'box-set',
          apiId: '1',
          mediaType: 'tv', 
          format: ['4k'],
          genres: [],
          image: '',
          overview: '',
        }
      ]

      const AppDataServiceMock = component.point.injector.get(AppDataService);
      const toastSpy = spyOn(component.point.componentInstance, 'createToast');

      component.point.componentInstance.handleSelection(selection, false, 'bluray');
      
      expect(AppDataServiceMock.saveSelection).not.toHaveBeenCalled();
      expect(component.point.componentInstance.isLoadingBluray.get(selection.id)).toBeFalse();
      expect(component.point.componentInstance.isSavedBluray.get(selection.id)).toBeTrue();
      expect(component.point.componentInstance.isLoading4k.size).toEqual(0);
      expect(component.point.componentInstance.isSaved4k.size).toEqual(0);
      expect(toastSpy).toHaveBeenCalledWith('Entry Already Exists', 'warning');
      
    })

    it('should display error toast when saveState is false and Current tracker list is empty', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();

      const selection = {
        id: '1',
        name: 'test',
        formate: ''
      }

      component.point.componentInstance.currentTrackerList = [
        {
          title: 'test',
          season: 'box-set',
          apiId: '2',
          mediaType: 'tv', 
          format: ['4k'],
          genres: [],
          image: '',
          overview: '',
        }
      ]

      const AppDataServiceMock = component.point.injector.get(AppDataService);
      const toastSpy = spyOn(component.point.componentInstance, 'createToast');

      component.point.componentInstance.handleSelection(selection, false, 'bluray');
      
      expect(AppDataServiceMock.saveSelection).not.toHaveBeenCalled();
      expect(toastSpy).toHaveBeenCalledWith('Error, clear search and try again.', 'danger');
      
    })

    afterEach(MockInstance.restore);

  });

  describe('createToast', () => {

    beforeEach(() => {  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({}))
      }))

      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>(),
      }));
    
    })

    beforeEach(() => MockInstance.remember);

    it('should create message with default color as none is passed', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const toastSpy = component.point.injector.get(ToastController);

      component.point.componentInstance.createToast('test message');
      
      expect(toastSpy.create).toHaveBeenCalledWith({
        message: 'test message',
        duration: 3000,
        color: 'default'
      })
      
    })

    it('should create message with danger color which is passed', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const toastSpy = component.point.injector.get(ToastController);

      component.point.componentInstance.createToast('test message', 'danger');
      
      expect(toastSpy.create).toHaveBeenCalledWith({
        message: 'test message',
        duration: 3000,
        color: 'danger'
      })
      
    })

    afterEach(MockInstance.restore);

  });

  fdescribe('handleSavingEvent', () => {

    beforeEach(() => {  
      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
  
      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({}))
      }))

      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        savedEventEmittter: new EventEmitter<any>(),
      }));
    
    })

    beforeEach(() => MockInstance.remember);

    it('should create success toast and get new tracker list and stop loading for 4k', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const toastSpy = component.point.injector.get(ToastController);
      const appDataServiceSpy = component.point.injector.get(AppDataService);

      const selectionResponse = {
        status: true,
        item:{
          title: 'test',
          apiId: '2'
        }
      }

      component.point.componentInstance.isLoading4k.set(selectionResponse.item.apiId, true);
      component.point.componentInstance.currentFormat = '4k';
      component.point.componentInstance.handleSavingEvent(selectionResponse);
      
      expect(toastSpy.create).toHaveBeenCalledWith({
        message: 'test was saved in 4k',
        duration: 3000,
        color: 'success'
      })
      expect(appDataServiceSpy.getTrackerList).toHaveBeenCalled();
      expect(component.point.componentInstance.isLoading4k.get(selectionResponse.item.apiId)).toBeFalse();
      expect(component.point.componentInstance.currentFormat).toBe('');

    })

    it('should create success toast and get new tracker list and stop loading for bluray', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const toastSpy = component.point.injector.get(ToastController);
      const appDataServiceSpy = component.point.injector.get(AppDataService);

      const selectionResponse = {
        status: true,
        item:{
          title: 'test',
          apiId: '2'
        }
      }

      component.point.componentInstance.isLoadingBluray.set(selectionResponse.item.apiId, true);
      component.point.componentInstance.currentFormat = 'bluray';
      component.point.componentInstance.handleSavingEvent(selectionResponse);
      
      expect(toastSpy.create).toHaveBeenCalledWith({
        message: 'test was saved in bluray',
        duration: 3000,
        color: 'success'
      })
      expect(appDataServiceSpy.getTrackerList).toHaveBeenCalled();
      expect(component.point.componentInstance.isLoadingBluray.get(selectionResponse.item.apiId)).toBeFalse();
      expect(component.point.componentInstance.currentFormat).toBe('');
      
    })

    it('should create error toast', () => {

      

      const component = MockRender(AddPage);
      component.detectChanges();
      const toastSpy = component.point.injector.get(ToastController);
      const appDataServiceSpy = component.point.injector.get(AppDataService);

      const selectionResponse = {
        status: false,
        item:{
          title: 'test',
          apiId: '2'
        }
      }

      component.point.componentInstance.isLoadingBluray.set(selectionResponse.item.apiId, true);
      component.point.componentInstance.currentFormat = 'bluray';
      component.point.componentInstance.handleSavingEvent(selectionResponse);
      
      expect(toastSpy.create).toHaveBeenCalledWith({
        message: 'Error in saving, clear search and try again.',
        duration: 3000,
        color: 'danger'
      })
      
      expect(component.point.componentInstance.isLoadingBluray.get(selectionResponse.item.apiId)).toBeFalse();
      expect(component.point.componentInstance.currentFormat).toBe('');
      
    })

    afterEach(MockInstance.restore);

  });

});
