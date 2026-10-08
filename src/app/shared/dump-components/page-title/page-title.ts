import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-page-title',
  styleUrl: './page-title.scss',
  templateUrl: './page-title.html',
})
export class PageTitle {
  readonly sousTitre = input<string>('');
  readonly titre = input<string>('');
}
