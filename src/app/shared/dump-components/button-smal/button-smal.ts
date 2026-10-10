import { Component, effect, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button-smal',
  styleUrl: './button-smal.scss',
  templateUrl: './button-smal.html',
})
export class ButtonSmal {
  readonly symbole = input<string>('');
  readonly texte = input<string>('');
  // Lu seulement par les lecteurs d'écran : précise le bouton (ex. : « Modifier TechVision »).
  readonly texteMasque = input<string>('');
  // constructor() {
  //   effect(() => console.log(this.texteMasque()));
  // } // soit effect soit attendre ngOnInit

  readonly sender = output<void>();
}
