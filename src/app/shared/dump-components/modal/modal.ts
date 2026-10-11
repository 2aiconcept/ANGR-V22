import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal {
  readonly titre = input.required<string>();
  // Doit être unique dans la page : relie la modale à son titre pour les lecteurs d'écran.
  readonly identifiant = input<string>('modale');

  readonly fermeture = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  // L'élément qui avait le focus avant l'ouverture (ex. : le bouton « Supprimer »).
  private readonly elementOrigine = document.activeElement as HTMLElement | null;

  constructor() {
    // showModal() : le navigateur piège le focus dans la modale et ferme avec Échap.
    afterNextRender(() => this.dialog().nativeElement.showModal());
    // Quelle que soit la façon de fermer, la page retire la modale : on rend le focus à l'élément d'origine.
    inject(DestroyRef).onDestroy(() => this.elementOrigine?.focus());
  }

  protected fermer(): void {
    this.dialog().nativeElement.close();
  }

  // Un clic sur le fond grisé atteint le <dialog> lui-même, pas son contenu.
  protected fermerSiClicSurLeFond(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.fermer();
    }
  }
}
