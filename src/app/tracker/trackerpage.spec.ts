import { TrackerPage } from './tracker.page';
import { MockBuilder, MockComponent, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { TrackerPageModule } from './tracker.module';
import { AppDataService } from '../service/app-data.service';
import { EventEmitter } from '@angular/core';
import { TabsService } from '../service/tabs.service';
import { StorageResponse } from '../model/storage-response.model';
import { ToastController } from '@ionic/angular';

describe('TrackerPage', () => {

  beforeEach( () => MockBuilder(TrackerPage, TrackerPageModule));

  it('should create', () => {
    const component = MockRender(TrackerPage).point.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('clearReorder', () => {

    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))

      MockInstance(ToastController, () => ({
        create: jasmine.createSpy().and.returnValue(Promise.resolve({}))
      }))
    });

    beforeEach(MockInstance.remember);

    it('should set tracker list to previous tracker list', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();
      component.point.componentInstance.trackerList = [];
      component.point.componentInstance.previousTrackerList = [{
        mediaType: 'movie',
        apiId: '1',
        format: ['blu-ray'],
        title: 'test',
        image: 'test',
        overview: 'test',
        genres: [{name: 'test',id: 1}]
      }
    ];

      expect(component.point.componentInstance.trackerList.length).toEqual(0);
      component.point.componentInstance.clearReorder();
      expect(component.point.componentInstance.trackerList.length).toEqual(1);
    })

    afterEach(MockInstance.restore);
  })

  describe('toggleReorder', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        updateTrackerList: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should set previous tracker list to tracker list handle state change when reorder is false', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();
      component.point.componentInstance.previousTrackerList = [];
      component.point.componentInstance.trackerList = [{
        mediaType: 'movie',
        apiId: '1',
        format: ['blu-ray'],
        title: 'test',
        image: 'test',
        overview: 'test',
        genres: [{name: 'test',id: 1}]
      }
    ];
      component.point.componentInstance.isReorder = false;
      
      expect(component.point.componentInstance.previousTrackerList.length).toEqual(0);
      component.point.componentInstance.toggleReorder();
      expect(component.point.componentInstance.previousTrackerList.length).toEqual(1);
      expect(component.point.componentInstance.isReorder).toBeTrue();
      expect(component.point.componentInstance.isDelete).toBeFalse();
      expect(component.point.componentInstance.reorderButtonState).toBe('filled');
    })

    it('should trigger update tracker list and successful when reorder is true and change Order is true', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();
      component.point.componentInstance.trackerList = [];
      component.point.componentInstance.isReorder = true;
      component.point.componentInstance.changeReorder = true;

      expect(component.point.componentInstance.trackerList.length).toEqual(0);
      
      component.point.componentInstance.toggleReorder();
      expect(component.point.componentInstance.isLoading).toBeTrue();
    })

    it('should update state when change Order is true and reorder is true', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();
      component.point.componentInstance.trackerList = [];
      component.point.componentInstance.isReorder = true;
      component.point.componentInstance.changeReorder = false;

      expect(component.point.componentInstance.trackerList.length).toEqual(0);
      
      component.point.componentInstance.toggleReorder();
      expect(component.point.componentInstance.isReorder).toBeFalse();
      expect(component.point.componentInstance.reorderButtonState).toBe('');
    })


    afterEach(MockInstance.restore);
  })

  describe('deleteEntries', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>(),
        updateTrackerList: jasmine.createSpy().and.returnValue(Promise.resolve({status: true})),
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should set isModalOpen to true when confirm is false', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.isModalOpen = true;

      component.point.componentInstance.deleteEntries(false);
      expect(component.point.componentInstance.isModalOpen).toBeFalse();
    })

    it('should trigger update tracker list and successful when reorder is true and change Order is true', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.isModalOpen = true;
      component.point.componentInstance.trackerList = [
        {
          mediaType: 'movie',
          apiId: '1',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        },
        {
          mediaType: 'movie',
          apiId: '2',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        }
      ];

      component.point.componentInstance.deleteEntryList = [
        '1'
      ]

      expect(component.point.componentInstance.trackerList.length).toEqual(2);
      component.point.componentInstance.deleteEntries(true);
      expect(component.point.componentInstance.isLoading).toBeTrue();
      expect(component.point.componentInstance.trackerList.length).toEqual(1);

    })


    afterEach(MockInstance.restore);
  })

  describe('updateDeleteEntryList', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should create new delete entry list', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = []

      expect(component.point.componentInstance.deleteEntryList.length).toEqual(0);
      component.point.componentInstance.updateDeleteEntryList('1', true);
      expect(component.point.componentInstance.deleteEntryList.length).toEqual(1);
    })

    it('should trigger update tracker list and successful when reorder is true and change Order is true', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = ['1']

      expect(component.point.componentInstance.deleteEntryList.length).toEqual(1);
      component.point.componentInstance.updateDeleteEntryList('1', false);
      expect(component.point.componentInstance.deleteEntryList.length).toEqual(0);

    })


    afterEach(MockInstance.restore);
  })

  describe('toggleDelete', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should update state when delete list is empty and isDelete is false', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = []

      
      component.point.componentInstance.toggleDelete();
      expect(component.point.componentInstance.isReorder).toBeFalse();
      expect(component.point.componentInstance.isDelete).toBeTrue();
    })

    it('should update state when delete list is empty and isDelete is true', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = []
      component.point.componentInstance.isDelete = true

      
      component.point.componentInstance.toggleDelete();
      expect(component.point.componentInstance.isReorder).toBeFalse();
      expect(component.point.componentInstance.isDelete).toBeFalse();
    })

    it('should set previous tracker list to tracker list and set remove list to filter tracker list when delete list is not empty', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = ['1']
      component.point.componentInstance.trackerList = [
        {
          mediaType: 'movie',
          apiId: '1',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        },
        {
          mediaType: 'movie',
          apiId: '2',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        }
      ];

      
      component.point.componentInstance.toggleDelete();
      expect(component.point.componentInstance.removeEntryList.length).toEqual(1);
      expect(component.point.componentInstance.previousTrackerList.length).toEqual(2);
      expect(component.point.componentInstance.isModalOpen).toBeTrue();

    })


    afterEach(MockInstance.restore);
  })

  describe('toggleCheckBoxes', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should fill delete list it is empty ', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = []
      component.point.componentInstance.trackerList = [
        {
          mediaType: 'movie',
          apiId: '1',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        },
        {
          mediaType: 'movie',
          apiId: '2',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        }
      ];

      
      component.point.componentInstance.toggleCheckBoxes();
      expect(component.point.componentInstance.deleteEntryList.length).toEqual(2);
    })

    it('should clear delete list when not empty and remove list is empty', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = ['1']
      component.point.componentInstance.removeEntryList = [];

      
      component.point.componentInstance.toggleCheckBoxes();
      expect(component.point.componentInstance.deleteEntryList.length).toEqual(0);
    })

    it('should should clear delete list when not empty and set tracker list to previous tracker list and remove list is cleared', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      component.point.componentInstance.deleteEntryList = ['1']
      component.point.componentInstance.previousTrackerList = [
        {
          mediaType: 'movie',
          apiId: '1',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        },
        {
          mediaType: 'movie',
          apiId: '2',
          format: ['blu-ray'],
          title: 'test',
          image: 'test',
          overview: 'test',
          genres: [{name: 'test',id: 1}]
        }
      ];
      component.point.componentInstance.removeEntryList = [{
        mediaType: 'movie',
        apiId: '2',
        format: ['blu-ray'],
        title: 'test',
        image: 'test',
        overview: 'test',
        genres: [{name: 'test',id: 1}]
      }];
      component.point.componentInstance.trackerList = []

      expect(component.point.componentInstance.removeEntryList.length).toEqual(1);
      expect(component.point.componentInstance.trackerList.length).toEqual(0);
      component.point.componentInstance.toggleCheckBoxes();
      expect(component.point.componentInstance.removeEntryList.length).toEqual(0);
      expect(component.point.componentInstance.trackerList.length).toEqual(2);

    })


    afterEach(MockInstance.restore);
  })

  describe('formatDetail', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should return string if length is 15', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      const entry = {
        mediaType: 'movie',
        apiId: '1',
        format: ['blu-ray'],
        title: 'test over 15 characters',
        image: 'test',
        overview: 'testing a overview that is over 15 characters',
        genres: [{name: 'test',id: 1}]
      }

      expect(component.point.componentInstance.formatDetail(entry).length).toEqual(18);
      
    })

    it('should return string if length is 20', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      const entry = {
        mediaType: 'movie',
        apiId: '1',
        format: ['blu-ray'],
        title: 'test under 15',
        image: 'test',
        overview: 'testing under 15 characters',
        genres: [{name: 'test',id: 1}]
      }

      expect(component.point.componentInstance.formatDetail(entry).length).toEqual(20);

    })

    afterEach(MockInstance.restore);
  })

  describe('toggleGridListView', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should set grid state true', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      const event = {
        detail: {
          value: ['grid']
        }
      }

      component.point.componentInstance.toggleGridListView(event);

      expect(component.point.componentInstance.isGrid).toBeTrue();
      
    })

    it('should set grid state false', () => {
        
      const component = MockRender(TrackerPage);
      component.detectChanges();

      const event = {
        detail: {
          value: ['other']
        }
      }

      component.point.componentInstance.toggleGridListView(event);

      expect(component.point.componentInstance.isGrid).toBeFalse();
      expect(component.point.componentInstance.isReorder).toBeFalse();
      expect(component.point.componentInstance.isDelete).toBeFalse();
      expect(component.point.componentInstance.deleteEntryList.length).toEqual(0);

    })

    afterEach(MockInstance.restore);
  })

  describe('loadTrackerList', () => {
    beforeEach(() => {
      MockInstance(AppDataService, () => ({
        getTrackerList: jasmine.createSpy(),
        trackerListEventEmittter: new EventEmitter<any>()
      }));

      MockInstance(TabsService, () => ({
        tabChangingEmiter: new EventEmitter<any>()
      }))
    });

    beforeEach(MockInstance.remember);

    it('should set tracker list', () => {
      const component = MockRender(TrackerPage);
      component.detectChanges();

      const exampleTrackerListResponse: StorageResponse = {
        status: true,
        item: [
          {
            mediaType: 'movie',
            apiId: '1',
            format: ['blu-ray'],
            title: 'test',
            image: 'test',
            overview: 'test',
            genres: [{name: 'test',id: 1}]
          },
          {
            mediaType: 'movie',
            apiId: '2',
            format: ['blu-ray'],
            title: 'test',
            image: 'test',
            overview: 'test',
            genres: [{name: 'test',id: 1}]
          }
        ]
      } 

      component.point.componentInstance.trackerList = [];

      expect(component.point.componentInstance.trackerList.length).toEqual(0);
      component.point.componentInstance.loadTrackerList(exampleTrackerListResponse);
      expect(component.point.componentInstance.isLoading).toBeFalse();
      expect(component.point.componentInstance.trackerList.length).toEqual(2);
      
    })

    afterEach(MockInstance.restore);
  })

});
