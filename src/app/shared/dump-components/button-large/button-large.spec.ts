import { TestBed } from '@angular/core/testing';
import { ButtonLarge } from './button-large';

describe('ButtonLarge', () => {
  async function afficher(entrees: Record<string, string>): Promise<HTMLButtonElement> {
    const fixture = TestBed.createComponent(ButtonLarge);
    for (const [nom, valeur] of Object.entries(entrees)) {
      fixture.componentRef.setInput(nom, valeur);
    }
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('button');
  }

  it('affiche le texte et le symbole', async () => {
    const bouton = await afficher({ symbole: '+', texte: 'Nouvelle entreprise' });

    expect(bouton.textContent).toContain('+');
    expect(bouton.textContent).toContain('Nouvelle entreprise');
  });

  it('cache le symbole aux lecteurs d’écran', async () => {
    const bouton = await afficher({ symbole: '+', texte: 'Nouvelle entreprise' });

    expect(bouton.querySelector('[aria-hidden="true"]')?.textContent).toBe('+');
  });

  it('est corail (primary) par défaut', async () => {
    const bouton = await afficher({ texte: 'Nouvelle entreprise' });

    expect(bouton.classList).toContain('btn-primary');
  });

  it('prend la couleur demandée et garde ses classes fixes', async () => {
    const bouton = await afficher({ texte: 'Nouvelle entreprise', couleur: 'dark' });

    expect(bouton.classList).toContain('btn-dark');
    expect(bouton.classList).not.toContain('btn-primary');
    expect(bouton.classList).toContain('btn');
  });

  it('émet sender quand on clique sur le bouton', async () => {
    const fixture = TestBed.createComponent(ButtonLarge);
    await fixture.whenStable();
    let nbClics = 0;
    fixture.componentInstance.sender.subscribe(() => nbClics++);

    fixture.nativeElement.querySelector('button').click();

    expect(nbClics).toBe(1);
  });
});
