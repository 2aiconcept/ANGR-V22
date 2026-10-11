import { TestBed } from '@angular/core/testing';
import { Entreprise, EntrepriseInput } from '../../utils/models/entreprise';
import { EntrepriseForm } from './entreprise-form';

const TECHVISION: Entreprise = {
  id: 1,
  nom: 'TechVision',
  secteur: 'IT & Cloud',
  adresse: "12 rue de l'Innovation, 75011 Paris",
  telephone: '01 45 67 89 00',
};

describe('EntrepriseForm', () => {
  async function creer(entreprise?: Entreprise) {
    const fixture = TestBed.createComponent(EntrepriseForm);
    if (entreprise) {
      fixture.componentRef.setInput('entreprise', entreprise);
    }
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    return { fixture, element };
  }

  function champ(element: HTMLElement, id: string): HTMLInputElement {
    return element.querySelector(`#${id}`) as HTMLInputElement;
  }

  function saisir(element: HTMLElement, id: string, texte: string): void {
    const input = champ(element, id);
    input.value = texte;
    input.dispatchEvent(new Event('input'));
  }

  it('affiche des champs vides en création', async () => {
    const { element } = await creer();

    expect(champ(element, 'entreprise-nom').value).toBe('');
  });

  it("pré-remplit les champs avec l'entreprise à modifier", async () => {
    const { element } = await creer(TECHVISION);

    expect(champ(element, 'entreprise-nom').value).toBe('TechVision');
    expect(champ(element, 'entreprise-telephone').value).toBe('01 45 67 89 00');
  });

  it("affiche une erreur et n'émet rien si le nom est vide", async () => {
    const { fixture, element } = await creer();
    let nbEmissions = 0;
    fixture.componentInstance.enregistrer.subscribe(() => nbEmissions++);

    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    expect(nbEmissions).toBe(0);
    expect(champ(element, 'entreprise-nom').getAttribute('aria-invalid')).toBe('true');
    expect(element.querySelector('#entreprise-nom-erreur')?.textContent).toContain(
      'Le nom est obligatoire.',
    );
  });

  it('émet les valeurs saisies quand le formulaire est valide', async () => {
    const { fixture, element } = await creer();
    let valeurs: EntrepriseInput | undefined;
    fixture.componentInstance.enregistrer.subscribe((v) => (valeurs = v));

    saisir(element, 'entreprise-nom', 'DataCorp');
    saisir(element, 'entreprise-secteur', 'Data & IA');
    element.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await fixture.whenStable();

    expect(valeurs).toEqual({ nom: 'DataCorp', secteur: 'Data & IA', adresse: '', telephone: '' });
  });

  it('émet annuler au clic sur Annuler', async () => {
    const { fixture, element } = await creer();
    let nbAnnulations = 0;
    fixture.componentInstance.annuler.subscribe(() => nbAnnulations++);

    Array.from(element.querySelectorAll('button'))
      .find((bouton) => bouton.textContent?.trim() === 'Annuler')
      ?.click();

    expect(nbAnnulations).toBe(1);
  });

  it("désactive le bouton Enregistrer pendant l'enregistrement", async () => {
    const { fixture, element } = await creer();
    fixture.componentRef.setInput('isEnregistrementEnCours', true);
    await fixture.whenStable();

    const bouton = element.querySelector<HTMLButtonElement>('button[type="submit"]');

    expect(bouton?.disabled).toBe(true);
    expect(bouton?.textContent).toContain('Enregistrement…');
  });
});
