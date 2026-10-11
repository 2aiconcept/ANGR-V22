import { Component, computed, inject, signal } from '@angular/core';
import { ListPageLayout } from '../../../layout/list-page-layout/list-page-layout';
import { EntreprisesService } from '../../data-access/entreprises-service';
import { Entreprise, EntrepriseInput } from '../../utils/models/entreprise';
import { ButtonLarge } from '../../../shared/dump-components/button-large/button-large';
import { PageTitle } from '../../../shared/dump-components/page-title/page-title';
import { DataTable } from '../../../shared/dump-components/data-table/data-table';
import { SearchField } from '../../../shared/dump-components/search-field/search-field';
import { Paginator } from '../../../shared/dump-components/paginator/paginator';
import { SidePanel } from '../../../shared/dump-components/side-panel/side-panel';
import { Modal } from '../../../shared/dump-components/modal/modal';
import { EntrepriseForm } from '../../dump-components/entreprise-form/entreprise-form';

const TAILLE_PAGE = 10;

@Component({
  imports: [
    ListPageLayout,
    ButtonLarge,
    PageTitle,
    DataTable,
    SearchField,
    Paginator,
    SidePanel,
    EntrepriseForm,
    Modal,
  ],
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

  // étape 3 : formulaire d'ajout / modification dans le panneau latéral ___________
  protected readonly isPanneauOuvert = signal(false);
  // null : création. Une entreprise : modification de celle-ci.
  protected readonly entrepriseAModifier = signal<Entreprise | null>(null);
  protected readonly isEnregistrementEnCours = signal(false);
  protected readonly hasErrorEnregistrement = signal(false);

  protected addEntreprise(): void {
    this.entrepriseAModifier.set(null);
    this.ouvrirPanneau();
  }

  protected modifierEntreprise(entreprise: Entreprise): void {
    this.entrepriseAModifier.set(entreprise);
    this.ouvrirPanneau();
  }

  protected fermerPanneau(): void {
    this.isPanneauOuvert.set(false);
  }

  protected async enregistrer(valeurs: EntrepriseInput): Promise<void> {
    this.isEnregistrementEnCours.set(true);
    this.hasErrorEnregistrement.set(false);
    const entreprise = this.entrepriseAModifier();
    try {
      if (entreprise === null) {
        await this.entreprisesService.ajouter(valeurs);
      } else {
        await this.entreprisesService.modifier(entreprise.id, valeurs);
      }
      this.fermerPanneau();
    } catch {
      // L'API a refusé ou ne répond pas : le panneau reste ouvert, avec un message.
      this.hasErrorEnregistrement.set(true);
    } finally {
      this.isEnregistrementEnCours.set(false);
    }
  }

  private ouvrirPanneau(): void {
    this.hasErrorEnregistrement.set(false);
    this.isPanneauOuvert.set(true);
  }

  // étape 4 : suppression __________________________________________________________
  // null : modale fermée. Une entreprise : la modale demande de confirmer sa suppression.
  protected readonly entrepriseASupprimer = signal<Entreprise | null>(null);
  protected readonly hasErrorSuppression = signal(false);

  protected supprimerEntreprise(entreprise: Entreprise): void {
    this.hasErrorSuppression.set(false);
    this.entrepriseASupprimer.set(entreprise);
  }

  protected fermerModale(): void {
    this.entrepriseASupprimer.set(null);
  }

  protected async confirmerSuppression(entreprise: Entreprise): Promise<void> {
    this.fermerModale();
    try {
      await this.entreprisesService.supprimer(entreprise.id);
    } catch {
      this.hasErrorSuppression.set(true);
    }
  }
}
