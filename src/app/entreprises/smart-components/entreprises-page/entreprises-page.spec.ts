import { TestBed } from '@angular/core/testing';
import { EntreprisesPage } from './entreprises-page';

describe('EntreprisesPage', () => {
  async function afficher(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(EntreprisesPage);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le titre de la page dans un h1', async () => {
    const page = await afficher();

    expect(page.querySelector('h1')?.textContent).toContain('Entreprises');
  });

  it('affiche une ligne par entreprise dans le tableau', async () => {
    const page = await afficher();

    const lignes = page.querySelectorAll('tbody tr');

    expect(lignes.length).toBe(4);
    expect(lignes[0].textContent).toContain('Durand Industries');
  });

  it("affiche le nombre d'entreprises", async () => {
    const page = await afficher();

    expect(page.textContent).toContain('4 entreprises affichées');
  });

  it('affiche les initiales sans tenir compte du « & »', async () => {
    const page = await afficher();

    const ligne = page.querySelectorAll('tbody tr')[2];

    expect(ligne.textContent).toContain('BF');
  });
});
