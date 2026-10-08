import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SplitLayout } from './split-layout';

@Component({
  imports: [SplitLayout],
  template: `
    <app-split-layout>
      <p splitLeft>Présentation</p>
      <p splitRight>Formulaire</p>
    </app-split-layout>
  `,
})
class TestHost {}

describe('SplitLayout', () => {
  async function afficher(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('affiche le contenu splitRight dans la zone principale', async () => {
    const page = await afficher();

    const main = page.querySelector('main');

    expect(main?.textContent).toContain('Formulaire');
  });

  it('affiche le contenu splitLeft hors de la zone principale', async () => {
    const page = await afficher();

    const main = page.querySelector('main');

    expect(page.textContent).toContain('Présentation');
    expect(main?.textContent).not.toContain('Présentation');
  });
});
