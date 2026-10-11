import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EntreprisesService } from '../../data-access/entreprises-service';
import { Entreprise } from '../../utils/models/entreprise';
import { EntreprisesPage } from './entreprises-page';

// 12 entreprises : 10 sur la page 1, 2 sur la page 2.
function creerEntreprises(nombre: number): Entreprise[] {
  return Array.from({ length: nombre }, (_, index) => ({
    id: index + 1,
    nom: `Entreprise ${index + 1}`,
  }));
}

describe('EntreprisesPage', () => {
  async function afficher(
    entreprises: Entreprise[],
    etat = { isLoading: false, error: undefined as Error | undefined },
  ): Promise<HTMLElement> {
    const fauxService = {
      entreprises: signal(entreprises),
      isLoading: signal(etat.isLoading),
      error: signal(etat.error),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: EntreprisesService, useValue: fauxService }],
    });
    const fixture = TestBed.createComponent(EntreprisesPage);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le titre de la page dans un h1', async () => {
    const page = await afficher([]);

    expect(page.querySelector('h1')?.textContent).toContain('Entreprises');
  });

  it('affiche les 10 premières entreprises du service sur la page 1', async () => {
    const page = await afficher(creerEntreprises(12));

    const lignes = page.querySelectorAll('tbody tr');

    expect(lignes.length).toBe(10);
    expect(lignes[0].textContent).toContain('Entreprise 1');
  });

  it("affiche le nombre total d'entreprises", async () => {
    const page = await afficher(creerEntreprises(12));

    expect(page.textContent).toContain('12 entreprises affichées');
  });

  it('affiche un message pendant le chargement', async () => {
    const page = await afficher([], { isLoading: true, error: undefined });

    expect(page.textContent).toContain('Chargement des entreprises…');
  });

  it("affiche une alerte si le chargement a échoué", async () => {
    const page = await afficher([], { isLoading: false, error: new Error('API indisponible') });

    expect(page.querySelector('[role="alert"]')?.textContent).toContain(
      'Impossible de charger les entreprises',
    );
  });

  it("n'affiche ni chargement ni alerte une fois les entreprises reçues", async () => {
    const page = await afficher(creerEntreprises(2));

    expect(page.textContent).not.toContain('Chargement');
    expect(page.querySelector('[role="alert"]')).toBeNull();
  });
});
