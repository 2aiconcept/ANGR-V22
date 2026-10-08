import { Component, input, output } from '@angular/core';
import { ButtonSmal } from '../button-smal/button-smal';

@Component({
  imports: [ButtonSmal],
  selector: 'app-data-table',
  styleUrl: './data-table.scss',
  templateUrl: './data-table.html',
})
export class DataTable {
  readonly legende = input.required<string>();
  readonly colonnes = input.required<string[]>();
  readonly lignes = input.required<any[]>();

  readonly modifier = output<any>();
}
