import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ViewEntriesComponent } from './view-entries.component';
import { AppDataService } from '../services/appData.service';

const ENTRIES_MOCK = [
  {
      title: 'title1',
      type: 'bluray',
      certificate: '18'
  },
  {
      title: 'title2',
      type: 'bluray',
      certificate: '15'
  },
  {
      title: 'title3',
      type: '4k',
      certificate: 'pg'
  },
]

fdescribe('ViewEntriesComponent', () => {
  let fixture: ComponentFixture<ViewEntriesComponent>;
  let component: ViewEntriesComponent;
  let appDataServiceSpy: jasmine.SpyObj<AppDataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AppService', ['getEntries'])

    TestBed.configureTestingModule({
      imports: [FormsModule, AgGridModule],
      declarations: [ViewEntriesComponent],
      providers:[
        {provide: AppDataService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(ViewEntriesComponent);
    component = fixture.componentInstance;
    appDataServiceSpy = TestBed.inject(AppDataService) as jasmine.SpyObj<AppDataService>;
  });

  describe('grid API', () => {
    it('should not be avalailable unilt "detectChanges"', () => {
      expect(component.gridApi).not.toBeTruthy();
    });

    it('should be available after "detectChanges"', () => {
      appDataServiceSpy.getEntries.and.returnValue(ENTRIES_MOCK);
      fixture.detectChanges();
      expect(component.gridApi).toBeTruthy();
    });
  });

  describe('grid data', () => {
    it('should contain following data', () => {
      component.rowData = ENTRIES_MOCK;
      fixture.detectChanges();

      const appElement = fixture.nativeElement;
      const cellElement = appElement.querySelectorAll('.ag-cell-value');

      expect(cellElement.length).toEqual(9);
      expect(cellElement[0].textContent).toEqual('title1');
    });
  });
});
