import { Component, computed, signal } from '@angular/core';
import { ListPageLayout } from '../../../layout/list-page-layout/list-page-layout';
import { Entreprise } from '../../utils/models/entreprise';
import { ButtonLarge } from '../../../shared/dump-components/button-large/button-large';
import { PageTitle } from '../../../shared/dump-components/page-title/page-title';
import { DataTable } from '../../../shared/dump-components/data-table/data-table';
import { SearchField } from '../../../shared/dump-components/search-field/search-field';
import { Paginator } from '../../../shared/dump-components/paginator/paginator';

const TAILLE_PAGE = 10;

@Component({
  imports: [ListPageLayout, ButtonLarge, PageTitle, DataTable, SearchField, Paginator],
  selector: 'app-entreprises-page',
  styleUrl: './entreprises-page.scss',
  templateUrl: './entreprises-page.html',
})
export class EntreprisesPage {
  protected readonly colonnes = ['nom', 'secteur', 'adresse', 'telephone'];

  // Données écrites en dur en attendant le service et l'API.
  protected readonly entreprises = signal<Entreprise[]>([
    {
      id: 1,
      nom: 'TechVision',
      secteur: 'IT & Cloud',
      adresse: "12 rue de l'Innovation, 75011 Paris",
      telephone: '01 45 67 89 00',
    },
    {
      id: 2,
      nom: 'StratConseil',
      secteur: 'Conseil',
      adresse: '8 avenue Foch, 69006 Lyon',
      telephone: '04 72 33 45 00',
    },
    {
      id: 3,
      nom: 'ShopNow',
      secteur: 'E-commerce',
      adresse: '25 quai des Chartrons, 33000 Bordeaux',
      telephone: '05 56 12 34 00',
    },
    {
      id: 4,
      nom: 'FinFlow',
      secteur: 'Fintech',
      adresse: '3 place Bellecour, 69002 Lyon',
      telephone: '04 78 90 12 00',
    },
    {
      id: 1,
      nom: 'TechVision',
      secteur: 'IT & Cloud',
      adresse: "12 rue de l'Innovation, 75011 Paris",
      telephone: '01 45 67 89 00',
    },
    {
      id: 2,
      nom: 'StratConseil',
      secteur: 'Conseil',
      adresse: '8 avenue Foch, 69006 Lyon',
      telephone: '04 72 33 45 00',
    },
    {
      id: 3,
      nom: 'ShopNow',
      secteur: 'E-commerce',
      adresse: '25 quai des Chartrons, 33000 Bordeaux',
      telephone: '05 56 12 34 00',
    },
    {
      id: 4,
      nom: 'FinFlow',
      secteur: 'Fintech',
      adresse: '3 place Bellecour, 69002 Lyon',
      telephone: '04 78 90 12 00',
    },
    {
      id: 1,
      nom: 'TechVision',
      secteur: 'IT & Cloud',
      adresse: "12 rue de l'Innovation, 75011 Paris",
      telephone: '01 45 67 89 00',
    },
    {
      id: 2,
      nom: 'StratConseil',
      secteur: 'Conseil',
      adresse: '8 avenue Foch, 69006 Lyon',
      telephone: '04 72 33 45 00',
    },
    {
      id: 3,
      nom: 'ShopNow',
      secteur: 'E-commerce',
      adresse: '25 quai des Chartrons, 33000 Bordeaux',
      telephone: '05 56 12 34 00',
    },
    {
      id: 4,
      nom: 'FinFlow',
      secteur: 'Fintech',
      adresse: '3 place Bellecour, 69002 Lyon',
      telephone: '04 78 90 12 00',
    },
  ]);

  protected readonly pageCourante = signal(1);

  protected readonly nbPages = computed(() =>
    Math.max(1, Math.ceil(this.entreprises().length / TAILLE_PAGE)),
  );

  protected readonly entreprisesDeLaPage = computed(() => {
    const debut = (this.pageCourante() - 1) * TAILLE_PAGE;
    return this.entreprises().slice(debut, debut + TAILLE_PAGE);
  });

  protected initiales(nom: string): string {
    return nom
      .split(' ')
      .filter((mot) => mot.length > 1) // ignore « & » dans « Berthier & Fils »
      .slice(0, 2)
      .map((mot) => mot[0])
      .join('')
      .toUpperCase();
  }

  addEntreprise() {
    console.log('add entreprise clicked');
  }

  protected modifierEntreprise(entreprise: Entreprise): void {
    console.log(entreprise);
  }
}
