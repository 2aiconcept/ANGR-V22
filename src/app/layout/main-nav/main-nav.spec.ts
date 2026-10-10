import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MainNav } from './main-nav';

@Component({ template: '' })
class PageVide {}

describe('MainNav', () => {
  async function afficherSur(adresse: string): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'entreprises', component: PageVide },
          { path: 'contacts', component: PageVide },
          { path: 'opportunites', component: PageVide },
        ]),
      ],
    });
    const fixture = TestBed.createComponent(MainNav);
    await TestBed.inject(Router).navigateByUrl(adresse);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche les trois liens vers les pages de liste', async () => {
    const nav = await afficherSur('/entreprises');

    const liens = Array.from(nav.querySelectorAll('a')).map((a) => [
      a.textContent?.trim(),
      a.getAttribute('href'),
    ]);

    expect(liens).toEqual([
      ['Entreprises', '/entreprises'],
      ['Contacts', '/contacts'],
      ['Opportunités', '/opportunites'],
    ]);
  });

  it('signale la page courante avec aria-current', async () => {
    const nav = await afficherSur('/contacts');

    const lienCourant = nav.querySelector('[aria-current="page"]');

    expect(lienCourant?.textContent?.trim()).toBe('Contacts');
  });
});
