import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunitesPage } from './opportunites-page';

describe('OpportunitesPage', () => {
  let component: OpportunitesPage;
  let fixture: ComponentFixture<OpportunitesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
