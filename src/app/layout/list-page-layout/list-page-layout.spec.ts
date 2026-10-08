import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ListPageLayout } from './list-page-layout';

@Component({
  imports: [ListPageLayout],
  template: `
    <app-list-page-layout>
      <p pageFooter>Pied de page</p>
      <p>Tableau</p>
      <p pageToolbar>Recherche</p>
      <p pageKpis>Chiffres</p>
      <p pageHeader>Titre</p>
    </app-list-page-layout>
  `,
})
class TestHost {}

describe('ListPageLayout', () => {
  async function afficher(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le contenu de chaque zone', async () => {
    const page = await afficher();

    for (const texte of ['Titre', 'Chiffres', 'Recherche', 'Tableau', 'Pied de page']) {
      expect(page.textContent).toContain(texte);
    }
  });

  it("range les zones dans l'ordre de la page, quel que soit l'ordre d'écriture", async () => {
    const page = await afficher();

    const textes = Array.from(page.querySelectorAll('p')).map((p) => p.textContent);

    expect(textes).toEqual(['Titre', 'Chiffres', 'Recherche', 'Tableau', 'Pied de page']);
  });
});
