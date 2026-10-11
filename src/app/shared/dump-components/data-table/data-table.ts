import { Component, input, output } from '@angular/core';
import { AvatarInitials } from '../avatar-initials/avatar-initials';
import { ButtonSmal } from '../button-smal/button-smal';

@Component({
  imports: [ButtonSmal, AvatarInitials],
  selector: 'app-data-table',
  styleUrl: './data-table.scss',
  templateUrl: './data-table.html',
})
export class DataTable {
  readonly legende = input.required<string>();
  readonly colonnes = input.required<string[]>();
  readonly lignes = input.required<any[]>();
  // Facultatif : nom de la colonne devant laquelle afficher l'avatar d'initiales (ex. : 'nom').
  readonly colonneAvatar = input<string>();

  readonly modifier = output<any>();
  readonly supprimer = output<any>();
}
