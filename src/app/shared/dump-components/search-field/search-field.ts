import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-search-field',
  styleUrl: './search-field.scss',
  templateUrl: './search-field.html',
  // Prend toute la largeur disponible dans la barre d'outils de la page.
  host: { class: 'flex-grow-1' },
})
export class SearchField {
  readonly libelle = input.required<string>();
  readonly placeholder = input<string>('');
  readonly valeur = input<string>('');
  // Doit être unique dans la page : relie le <label> au champ.
  readonly identifiant = input<string>('recherche');

  readonly recherche = output<string>();
}
