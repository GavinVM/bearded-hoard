import { TabsPage } from './tabs.page';
import { MockBuilder, MockInstance, MockRender, MockService, ngMocks } from 'ng-mocks';
import { TabsPageModule } from './tabs.module';
import { DeviceDetectorService } from 'ngx-device-detector';

describe('TabsPage', () => {

  describe('gnereal checks', () => {

    beforeEach(() =>  MockBuilder(TabsPage, TabsPageModule))

    it('should create', () => {
      const fixture = MockRender(TabsPage);
  
      expect(fixture.point.componentInstance).toBeDefined();
    });

    it('should call adjustlandingPage when resize is triggered', () => {
      const fixture = MockRender(TabsPage);
      const adjustlandingPageSpy = spyOn(fixture.componentInstance, 'checkIfDeviceMobile');

      fixture.detectChanges
      window.dispatchEvent(new Event('resize'));

      expect(adjustlandingPageSpy).toHaveBeenCalled();
    })
  })
  
   describe('for mobile or tablet device', () => {
      beforeEach(() =>  MockBuilder(TabsPage, TabsPageModule).mock(DeviceDetectorService, {
          isMobile: jasmine.createSpy().and.returnValue(true),
          isTablet: jasmine.createSpy().and.returnValue(true)
        })
      );

      it('should initial values', () => {
    
        spyOnProperty(window, 'innerWidth').and.returnValue(1000)
    
        const fixture = MockRender(TabsPage);
        fixture.detectChanges
    
        expect(fixture.componentInstance.cexOutline).toEqual('/assets/icon/cex-outline.svg')
        expect(fixture.componentInstance.isLandingPage).toBeFalse();
        expect(fixture.componentInstance.largeScreenAjustment).toEqual('exampleFrame');
    
      })

      it('should call checkIfDeviceMoblie when adjustlandingPage is called', () => {
    
        spyOnProperty(window, 'innerWidth').and.returnValue(1000)

        const fixture = MockRender(TabsPage);
        const checkIfDeviceMobileSpy = spyOn(fixture.componentInstance, 'checkIfDeviceMobile');
        fixture.detectChanges();
        fixture.componentInstance.adjustlandingPage();

        expect(checkIfDeviceMobileSpy).toHaveBeenCalled()       
    
      })

      it('should return false when checkIfDeviceMoblie is called', () => {
    
        spyOnProperty(window, 'innerWidth').and.returnValue(1000)

        const fixture = MockRender(TabsPage);
        fixture.detectChanges();
        

        expect(fixture.componentInstance.checkIfDeviceMobile()).toBeFalse();
    
      })
  })

  describe('for other devices/desktops', () => {
    beforeEach(() =>  MockBuilder(TabsPage, TabsPageModule).mock(DeviceDetectorService, {
        isMobile: jasmine.createSpy().and.returnValue(false),
        isTablet: jasmine.createSpy().and.returnValue(false)
      })
    );

    it('should initial values', () => {
  
      spyOnProperty(window, 'innerWidth').and.returnValue(1300)

      const fixture = MockRender(TabsPage);
      fixture.detectChanges

      expect(fixture.componentInstance.cexOutline).toEqual('/assets/icon/cex-outline.svg')
      expect(fixture.componentInstance.isLandingPage).toBeTrue();
      expect(fixture.componentInstance.largeScreenAjustment).toEqual('exampleFrame largeScreenAdjust');
  
    })

    it('should call checkIfDeviceMoblie when adjustlandingPage is called', () => {
  
      spyOnProperty(window, 'innerWidth').and.returnValue(1300)

      const fixture = MockRender(TabsPage);
      const checkIfDeviceMobileSpy = spyOn(fixture.componentInstance, 'checkIfDeviceMobile');
      fixture.detectChanges();
      fixture.componentInstance.adjustlandingPage();

      expect(checkIfDeviceMobileSpy).toHaveBeenCalled()       
  
    })

    it('should return false when checkIfDeviceMoblie is called', () => {
  
      spyOnProperty(window, 'innerWidth').and.returnValue(1300)

      const fixture = MockRender(TabsPage);
      fixture.detectChanges();
      

      expect(fixture.componentInstance.checkIfDeviceMobile()).toBeTrue();
  
    })
  })


});
