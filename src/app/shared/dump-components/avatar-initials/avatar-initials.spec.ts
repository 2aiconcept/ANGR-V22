import { TestBed } from '@angular/core/testing';
import { AvatarInitials } from './avatar-initials';

describe('AvatarInitials', () => {
  async function afficher(nom: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(AvatarInitials);
    fixture.componentRef.setInput('nom', nom);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('span');
  }

  it("affiche l'initiale d'un nom en un seul mot", async () => {
    expect((await afficher('TechVision')).textContent?.trim()).toBe('T');
  });

  it('affiche les initiales des deux premiers mots', async () => {
    expect((await afficher('Durand Industries Lyon')).textContent?.trim()).toBe('DI');
  });

  it('ignore les mots d’une seule lettre comme « & »', async () => {
    expect((await afficher('Berthier & Fils')).textContent?.trim()).toBe('BF');
  });

  it('est caché aux lecteurs d’écran, le nom étant écrit à côté', async () => {
    expect((await afficher('TechVision')).getAttribute('aria-hidden')).toBe('true');
  });
});
