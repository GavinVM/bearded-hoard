import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ENTRIES_MOCK } from 'src/mock-data/entries-mock.data';
import { ViewEntriesComponent } from './view-entries.component';

describe('ViewEntriesComponent', () => {
  let fixture: ComponentFixture<ViewEntriesComponent>;
  let component: ViewEntriesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AgGridModule],
      declarations: [ViewEntriesComponent],
    });

    fixture = TestBed.createComponent(ViewEntriesComponent);
    component = fixture.componentInstance;
  });

  describe('grid API', () => {
    it('should not be avalailable unilt "detectChanges"', () => {
      expect(component.grid.api).not.toBeTruthy();
    });

    it('should be available after "detectChanges"', () => {
      fixture.detectChanges();
      expect(component.grid.api).toBeTruthy();
    });
  });

  describe('grid data', () => {
    it('should contain following data', () => {
      component.rowData = ENTRIES_MOCK;
      fixture.detectChanges();

      const appElement = fixture.nativeElement;
      const cellElement = appElement.querySelectorAll('.ag-cell-value');

      expect(cellElement.length).toEqual(6);
      expect(cellElement[0].textContent).toEqual('title1');
    });
  });
});
