import { TestBed } from '@angular/core/testing';
import { Paginator } from './paginator';

describe('Paginator', () => {
  async function creer() {
    const fixture = TestBed.createComponent(Paginator);
    fixture.componentRef.setInput('nbElements', 12);
    fixture.componentRef.setInput('libelle', 'contacts affichés');
    fixture.componentRef.setInput('pageCourante', 2);
    fixture.componentRef.setInput('nbPages', 3);
    await fixture.whenStable();
    return fixture;
  }

  it('affiche le nombre d’éléments suivi du libellé', async () => {
    const fixture = await creer();

    expect(fixture.nativeElement.querySelector('p').textContent).toBe('12 contacts affichés');
  });

  it('affiche un bouton par page', async () => {
    const fixture = await creer();

    expect(fixture.nativeElement.querySelectorAll('nav button').length).toBe(3);
  });

  it('signale la page courante', async () => {
    const fixture = await creer();

    const boutonCourant = fixture.nativeElement.querySelector('[aria-current="page"]');

    expect(boutonCourant.textContent).toContain('2');
  });

  it('émet le numéro de la page cliquée', async () => {
    const fixture = await creer();
    let pageEmise = 0;
    fixture.componentInstance.changementPage.subscribe((page) => (pageEmise = page));

    fixture.nativeElement.querySelectorAll('nav button')[2].click();

    expect(pageEmise).toBe(3);
  });
});
