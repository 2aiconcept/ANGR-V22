import { TestBed } from '@angular/core/testing';
import { DataTable } from './data-table';

describe('DataTable', () => {
  async function creer() {
    const fixture = TestBed.createComponent(DataTable);
    fixture.componentRef.setInput('legende', 'Liste de test');
    fixture.componentRef.setInput('colonnes', ['nom', 'ville']);
    fixture.componentRef.setInput('lignes', [
      { nom: 'Alpha', ville: 'Lyon' },
      { nom: 'Beta', ville: 'Paris' },
    ]);
    await fixture.whenStable();
    return fixture;
  }

  async function afficher(): Promise<HTMLElement> {
    const fixture = await creer();
    return fixture.nativeElement;
  }

  it('affiche un en-tête par colonne, puis la colonne Actions', async () => {
    const tableau = await afficher();

    const entetes = Array.from(tableau.querySelectorAll('th')).map((th) => th.textContent?.trim());

    expect(entetes).toEqual(['nom', 'ville', 'Actions']);
  });

  it('émet modifier avec la ligne quand on clique sur son bouton Modifier', async () => {
    const fixture = await creer();
    let ligneEmise: unknown;
    fixture.componentInstance.modifier.subscribe((ligne) => (ligneEmise = ligne));

    fixture.nativeElement.querySelectorAll('tbody button')[1].click();

    expect(ligneEmise).toEqual({ nom: 'Beta', ville: 'Paris' });
  });

  it('affiche une ligne par élément de la collection', async () => {
    const tableau = await afficher();

    expect(tableau.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('affiche dans chaque cellule la valeur de la colonne', async () => {
    const tableau = await afficher();

    const cellules = Array.from(tableau.querySelectorAll('tbody tr')[1].querySelectorAll('td')).map(
      (td) => td.textContent?.trim(),
    );

    expect(cellules.slice(0, 2)).toEqual(['Beta', 'Paris']);
  });

  it('affiche la légende du tableau pour les lecteurs d’écran', async () => {
    const tableau = await afficher();

    expect(tableau.querySelector('caption')?.textContent?.trim()).toBe('Liste de test');
  });
});
