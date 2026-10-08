import { TestBed } from '@angular/core/testing';
import { ButtonSmal } from './button-smal';

describe('ButtonSmal', () => {
  async function creer() {
    const fixture = TestBed.createComponent(ButtonSmal);
    fixture.componentRef.setInput('symbole', '✎');
    fixture.componentRef.setInput('texte', 'Modifier');
    fixture.componentRef.setInput('texteMasque', 'TechVision');
    await fixture.whenStable();
    return fixture;
  }

  it('affiche le texte, et le texte masqué pour les lecteurs d’écran', async () => {
    const fixture = await creer();
    const bouton: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(bouton.textContent).toContain('Modifier');
    expect(bouton.querySelector('.visually-hidden')?.textContent).toBe('TechVision');
  });

  it('émet sender quand on clique sur le bouton', async () => {
    const fixture = await creer();
    let nbClics = 0;
    fixture.componentInstance.sender.subscribe(() => nbClics++);

    fixture.nativeElement.querySelector('button').click();

    expect(nbClics).toBe(1);
  });
});
