import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportuniteFormPage } from './opportunite-form-page';

describe('OpportuniteFormPage', () => {
  let component: OpportuniteFormPage;
  let fixture: ComponentFixture<OpportuniteFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportuniteFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportuniteFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
