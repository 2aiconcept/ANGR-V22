import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EntreprisesService } from '../../data-access/entreprises-service';
import { Entreprise, EntrepriseInput } from '../../utils/models/entreprise';
import { EntreprisesPage } from './entreprises-page';

// jsdom ne sait pas ouvrir un <dialog> en modal : on simule showModal().
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.open = true;
};

// 12 entreprises : 10 sur la page 1, 2 sur la page 2.
function creerEntreprises(nombre: number): Entreprise[] {
  return Array.from({ length: nombre }, (_, index) => ({
    id: index + 1,
    nom: `Entreprise ${index + 1}`,
  }));
}

// Faux service : garde la trace des appels, et peut simuler un refus de l'API.
function creerFauxService(
  entreprises: Entreprise[],
  etat = { isLoading: false, error: undefined as Error | undefined },
) {
  return {
    entreprises: signal(entreprises),
    isLoading: signal(etat.isLoading),
    error: signal(etat.error),
    isApiEnErreur: false,
    ajouts: [] as EntrepriseInput[],
    modifications: [] as { id: number; valeurs: EntrepriseInput }[],
    async ajouter(valeurs: EntrepriseInput) {
      if (this.isApiEnErreur) {
        throw new Error('400');
      }
      this.ajouts.push(valeurs);
    },
    async modifier(id: number, valeurs: EntrepriseInput) {
      this.modifications.push({ id, valeurs });
    },
  };
}

describe('EntreprisesPage', () => {
  async function afficher(fauxService: ReturnType<typeof creerFauxService>) {
    TestBed.configureTestingModule({
      providers: [{ provide: EntreprisesService, useValue: fauxService }],
    });
    const fixture = TestBed.createComponent(EntreprisesPage);
    await fixture.whenStable();
    const page: HTMLElement = fixture.nativeElement;
    return { fixture, page };
  }

  function bouton(page: HTMLElement, texte: string): HTMLButtonElement {
    return Array.from(page.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(texte),
    ) as HTMLButtonElement;
  }

  function saisirNom(page: HTMLElement, nom: string): void {
    const champNom = page.querySelector<HTMLInputElement>('#entreprise-nom');
    champNom!.value = nom;
    champNom!.dispatchEvent(new Event('input'));
  }

  it('affiche le titre de la page dans un h1', async () => {
    const { page } = await afficher(creerFauxService([]));

    expect(page.querySelector('h1')?.textContent).toContain('Entreprises');
  });

  it('affiche les 10 premières entreprises du service sur la page 1', async () => {
    const { page } = await afficher(creerFauxService(creerEntreprises(12)));

    const lignes = page.querySelectorAll('tbody tr');

    expect(lignes.length).toBe(10);
    expect(lignes[0].textContent).toContain('Entreprise 1');
  });

  it("affiche le nombre total d'entreprises", async () => {
    const { page } = await afficher(creerFauxService(creerEntreprises(12)));

    expect(page.textContent).toContain('12 entreprises affichées');
  });

  it('affiche un message pendant le chargement', async () => {
    const { page } = await afficher(creerFauxService([], { isLoading: true, error: undefined }));

    expect(page.textContent).toContain('Chargement des entreprises…');
  });

  it('affiche une alerte si le chargement a échoué', async () => {
    const erreur = new Error('API indisponible');
    const { page } = await afficher(creerFauxService([], { isLoading: false, error: erreur }));

    expect(page.querySelector('[role="alert"]')?.textContent).toContain(
      'Impossible de charger les entreprises',
    );
  });

  it("n'affiche ni chargement ni alerte une fois les entreprises reçues", async () => {
    const { page } = await afficher(creerFauxService(creerEntreprises(2)));

    expect(page.textContent).not.toContain('Chargement');
    expect(page.querySelector('[role="alert"]')).toBeNull();
  });

  it('ouvre le panneau « Nouvelle entreprise » au clic sur le bouton', async () => {
    const { fixture, page } = await afficher(creerFauxService([]));

    bouton(page, 'nouvelle entreprise').click();
    await fixture.whenStable();

    expect(page.querySelector('dialog h2')?.textContent).toBe('Nouvelle entreprise');
  });

  it('ajoute l’entreprise via le service, puis ferme le panneau', async () => {
    const fauxService = creerFauxService([]);
    const { fixture, page } = await afficher(fauxService);
    bouton(page, 'nouvelle entreprise').click();
    await fixture.whenStable();

    saisirNom(page, 'DataCorp');
    bouton(page, 'Enregistrer').click();
    await fixture.whenStable();

    expect(fauxService.ajouts).toEqual([
      { nom: 'DataCorp', secteur: '', adresse: '', telephone: '' },
    ]);
    expect(page.querySelector('dialog')).toBeNull();
  });

  it("modifie l'entreprise de la ligne cliquée via le service", async () => {
    const fauxService = creerFauxService(creerEntreprises(2));
    const { fixture, page } = await afficher(fauxService);
    bouton(page, 'Modifier Entreprise 2').click();
    await fixture.whenStable();

    saisirNom(page, 'Entreprise renommée');
    bouton(page, 'Enregistrer').click();
    await fixture.whenStable();

    expect(fauxService.modifications[0].id).toBe(2);
    expect(fauxService.modifications[0].valeurs.nom).toBe('Entreprise renommée');
  });

  it("garde le panneau ouvert avec un message si l'API refuse l'enregistrement", async () => {
    const fauxService = creerFauxService([]);
    fauxService.isApiEnErreur = true;
    const { fixture, page } = await afficher(fauxService);
    bouton(page, 'nouvelle entreprise').click();
    await fixture.whenStable();

    saisirNom(page, 'DataCorp');
    bouton(page, 'Enregistrer').click();
    await fixture.whenStable();

    expect(page.querySelector('dialog')).not.toBeNull();
    expect(page.querySelector('dialog [role="alert"]')?.textContent).toContain(
      "L'enregistrement a échoué",
    );
  });
});
