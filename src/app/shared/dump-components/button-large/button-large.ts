import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button-large',
  styleUrl: './button-large.scss',
  templateUrl: './button-large.html',
})
export class ButtonLarge {
  readonly symbole = input<string>('');
  readonly texte = input<string>('');
  readonly couleur = input<'primary' | 'secondary' | 'dark'>('primary');

  readonly sender = output<void>();
}
