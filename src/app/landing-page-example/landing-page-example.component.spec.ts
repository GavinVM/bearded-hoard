import { LandingPageExampleComponent } from './landing-page-example.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { LandingPageExampleModule } from './landing-page-example.module';

describe('LandingPageExampleComponent', () => {
  beforeEach( () => MockBuilder(LandingPageExampleComponent, LandingPageExampleModule));

  it('should create', () => {
    const component = MockRender(LandingPageExampleComponent).point.componentInstance;
    expect(component).toBeTruthy();
  });
});
