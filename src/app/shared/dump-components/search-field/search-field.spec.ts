import { TestBed } from '@angular/core/testing';
import { SearchField } from './search-field';

describe('SearchField', () => {
  async function creer() {
    const fixture = TestBed.createComponent(SearchField);
    fixture.componentRef.setInput('libelle', 'Rechercher une entreprise');
    fixture.componentRef.setInput('placeholder', 'Rechercher…');
    await fixture.whenStable();
    return fixture;
  }

  it('relie le libellé au champ de recherche', async () => {
    const fixture = await creer();
    const element: HTMLElement = fixture.nativeElement;

    const label = element.querySelector('label');
    const champ = element.querySelector('input');

    expect(label?.textContent).toBe('Rechercher une entreprise');
    expect(label?.getAttribute('for')).toBe(champ?.id);
  });

  it('affiche le placeholder et la valeur reçus', async () => {
    const fixture = await creer();
    fixture.componentRef.setInput('valeur', 'Tech');
    await fixture.whenStable();

    const champ: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(champ.placeholder).toBe('Rechercher…');
    expect(champ.value).toBe('Tech');
  });

  it('émet le texte saisi à chaque frappe', async () => {
    const fixture = await creer();
    let texteEmis = '';
    fixture.componentInstance.recherche.subscribe((texte) => (texteEmis = texte));
    const champ: HTMLInputElement = fixture.nativeElement.querySelector('input');

    champ.value = 'Shop';
    champ.dispatchEvent(new Event('input'));

    expect(texteEmis).toBe('Shop');
  });
});
