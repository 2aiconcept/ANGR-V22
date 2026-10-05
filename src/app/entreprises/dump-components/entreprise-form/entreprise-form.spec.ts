import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntrepriseForm } from './entreprise-form';

describe('EntrepriseForm', () => {
  let component: EntrepriseForm;
  let fixture: ComponentFixture<EntrepriseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrepriseForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EntrepriseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
