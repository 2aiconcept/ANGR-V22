import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Modal } from './modal';

// jsdom ne sait pas ouvrir un <dialog> en modal : on simule showModal() et close().
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.open = true;
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

@Component({
  imports: [Modal],
  template: `
    <button type="button">Ouvrir</button>
    @if (isOuverte()) {
      <app-modal titre="Supprimer l’entreprise" (fermeture)="nbFermetures = nbFermetures + 1">
        <p>Contenu projeté</p>
      </app-modal>
    }
  `,
})
class TestHost {
  readonly isOuverte = signal(true);
  nbFermetures = 0;
}

describe('Modal', () => {
  async function creer() {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    return fixture;
  }

  it('ouvre un dialog modal relié à son titre', async () => {
    const fixture = await creer();
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    const titreId = dialog.getAttribute('aria-labelledby');

    expect(dialog.open).toBe(true);
    expect(fixture.nativeElement.querySelector(`#${titreId}`)?.textContent).toBe(
      'Supprimer l’entreprise',
    );
  });

  it('affiche le contenu projeté', async () => {
    const fixture = await creer();

    expect(fixture.nativeElement.querySelector('dialog').textContent).toContain('Contenu projeté');
  });

  it('émet fermeture au clic sur le bouton Fermer', async () => {
    const fixture = await creer();

    fixture.nativeElement.querySelector('button[aria-label="Fermer"]').click();

    expect(fixture.componentInstance.nbFermetures).toBe(1);
  });

  it('émet fermeture au clic sur le fond grisé, pas au clic dans le contenu', async () => {
    const fixture = await creer();

    fixture.nativeElement.querySelector('dialog p').click();
    expect(fixture.componentInstance.nbFermetures).toBe(0);

    fixture.nativeElement.querySelector('dialog').click();
    expect(fixture.componentInstance.nbFermetures).toBe(1);
  });

  it("rend le focus à l'élément d'origine quand la page retire la modale", async () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.isOuverte.set(false);
    await fixture.whenStable();
    const boutonOrigine: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    boutonOrigine.focus();

    fixture.componentInstance.isOuverte.set(true);
    await fixture.whenStable();
    fixture.componentInstance.isOuverte.set(false);
    await fixture.whenStable();

    expect(document.activeElement).toBe(boutonOrigine);
  });
});
