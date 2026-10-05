import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntreprisesPage } from './entreprises-page';

describe('EntreprisesPage', () => {
  let component: EntreprisesPage;
  let fixture: ComponentFixture<EntreprisesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntreprisesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EntreprisesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
