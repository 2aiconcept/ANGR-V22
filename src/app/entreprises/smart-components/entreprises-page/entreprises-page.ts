import { Component } from '@angular/core';
import { ListPageLayout } from '../../../layout/list-page-layout/list-page-layout';
import { Entreprise } from '../../utils/models/entreprise';

@Component({
  imports: [ListPageLayout],
  selector: 'app-entreprises-page',
  styleUrl: './entreprises-page.scss',
  templateUrl: './entreprises-page.html',
})
export class EntreprisesPage {
  // Données écrites en dur en attendant le service et l'API.
  protected readonly entreprises: Entreprise[] = [
    {
      id: 1,
      nom: 'Durand Industries',
      secteur: 'Industrie',
      adresse: '12 rue des Fabriques, Lyon',
      telephone: '04 72 11 22 33',
      statut: 'Actif',
      nbContacts: 5,
    },
    {
      id: 2,
      nom: 'Novatek Solutions',
      secteur: 'Informatique',
      adresse: "8 av. de l'Innovation, Paris",
      telephone: '01 45 67 89 10',
      statut: 'Actif',
      nbContacts: 8,
    },
    {
      id: 3,
      nom: 'Berthier & Fils',
      secteur: 'BTP',
      adresse: '27 chemin du Port, Marseille',
      telephone: '04 91 33 44 55',
      statut: 'Inactif',
      nbContacts: 2,
    },
    {
      id: 4,
      nom: 'Aquitaine Logistique',
      secteur: 'Transport',
      adresse: '3 zone Sud, Bordeaux',
      telephone: '05 56 78 90 12',
      statut: 'Actif',
      nbContacts: 4,
    },
  ];

  protected readonly nbActives = this.entreprises.filter((e) => e.statut === 'Actif').length;
  protected readonly nbInactives = this.entreprises.filter((e) => e.statut === 'Inactif').length;
  protected readonly nbContactsLies = this.entreprises.reduce((total, e) => total + e.nbContacts, 0);

  protected initiales(nom: string): string {
    return nom
      .split(' ')
      .filter((mot) => mot.length > 1) // ignore « & » dans « Berthier & Fils »
      .slice(0, 2)
      .map((mot) => mot[0])
      .join('')
      .toUpperCase();
  }
}
