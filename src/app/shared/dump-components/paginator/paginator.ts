import { Component, computed, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-paginator',
  styleUrl: './paginator.scss',
  templateUrl: './paginator.html',
  // Compteur à gauche, numéros de page à droite, sur toute la largeur du pied de tableau.
  host: { class: 'd-flex flex-wrap align-items-center justify-content-between gap-3 w-100' },
})
export class Paginator {
  // Pour afficher le nombre d'elements
  readonly nbElements = input.required<number>();
  // Fin de la phrase du compteur, accordée par la page : « entreprises affichées », « contacts affichés »…
  readonly libelle = input.required<string>();
  // pour mettre les bonne class sur le bouton qui correspond à la page courante (fond bleu texte blanc)
  readonly pageCourante = input.required<number>();
  //
  readonly nbPages = input.required<number>();

  readonly changementPage = output<number>();
  ngOnInit() {
    console.log('pagecourante', this.pageCourante());
    console.log('nb pages', this.nbPages());
  }
  // [1, 2, 3, …] : un bouton par page.
  protected readonly pages = computed(
    () =>
      // Array.from({ length: this.nbPages() }, (_, index) => index + 1),
      Array(this.nbPages())
        .fill(0)
        .map((_, index) => index + 1), // [1, 2, 3]
  );
  changePage(page: number) {
    console.log(page);
    this.changementPage.emit(page);
  }
}
