import { TestBed } from '@angular/core/testing';
import { PageTitle } from './page-title';

describe('PageTitle', () => {
  async function afficher(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(PageTitle);
    fixture.componentRef.setInput('sousTitre', 'Portefeuille commercial');
    fixture.componentRef.setInput('titre', 'Entreprises');
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le titre dans un h1', async () => {
    const element = await afficher();

    expect(element.querySelector('h1')?.textContent).toBe('Entreprises');
  });

  it('affiche le sous-titre au-dessus du titre', async () => {
    const element = await afficher();

    expect(element.querySelector('p')?.textContent).toBe('Portefeuille commercial');
  });
});
