import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPage } from './auth-page';

describe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le titre de présentation dans un h1', () => {
    const titre = fixture.nativeElement.querySelector('h1');

    expect(titre.textContent).toContain('Vos entreprises, contacts et opportunités');
  });
});
