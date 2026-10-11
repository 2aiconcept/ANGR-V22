import { Component, computed, inject, signal } from '@angular/core';
import { ListPageLayout } from '../../../layout/list-page-layout/list-page-layout';
import { EntreprisesService } from '../../data-access/entreprises-service';
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
  // étape 1 : intitulé des colonnes à afficher dans data-table component
  protected readonly colonnes = ['nom', 'secteur', 'adresse', 'telephone'];

  // étape 1 :pour l'affichage des entreprises ______________________________________
  private readonly entreprisesService = inject(EntreprisesService);

  protected readonly entreprises = this.entreprisesService.entreprises;
  protected readonly isLoading = this.entreprisesService.isLoading;
  protected readonly error = this.entreprisesService.error;
  // fin étape 1 affichage entreprises avec loading et error_________________________

  // étape 2 : paginator ____________________________________________________________
  protected readonly pageCourante = signal(1);

  // étape 2 : paginator, calculer le nombre de pages
  protected readonly nbPages = computed(() =>
    Math.max(1, Math.ceil(this.entreprises().length / TAILLE_PAGE)),
  );

  // étape 2 : les entreprises à afficher selon la page en cours
  protected readonly entreprisesDeLaPage = computed(() => {
    const debut = (this.pageCourante() - 1) * TAILLE_PAGE;
    return this.entreprises().slice(debut, debut + TAILLE_PAGE);
  });

  addEntreprise() {
    console.log('add entreprise clicked');
  }

  protected modifierEntreprise(entreprise: Entreprise): void {
    console.log(entreprise);
  }
}
