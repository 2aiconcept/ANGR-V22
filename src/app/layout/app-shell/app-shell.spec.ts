import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  async function afficher(): Promise<HTMLElement> {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppShell);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it("affiche l'en-tête au-dessus de la zone principale", async () => {
    const shell = await afficher();

    const entete = shell.querySelector('header');
    const main = shell.querySelector('main');

    expect(entete).not.toBeNull();
    expect(main).not.toBeNull();
    expect(main?.contains(entete)).toBe(false);
  });
});
