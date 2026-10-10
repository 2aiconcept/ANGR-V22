import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppHeader } from './app-header';

describe('AppHeader', () => {
  async function afficher(): Promise<HTMLElement> {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppHeader);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le logo, qui ramène à la page Entreprises', async () => {
    const entete = await afficher();

    const logo = entete.querySelector('.navbar-brand');

    expect(logo?.textContent).toContain('liane');
    expect(logo?.getAttribute('href')).toBe('/entreprises');
  });

  it('contient la navigation principale', async () => {
    const entete = await afficher();

    expect(entete.querySelector('nav[aria-label="Navigation principale"]')).not.toBeNull();
  });
});
