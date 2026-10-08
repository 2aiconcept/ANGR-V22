export type StatutEntreprise = 'Actif' | 'Inactif';

export interface Entreprise {
  id: number;
  nom: string;
  secteur?: string;
  adresse?: string;
  telephone?: string;
  // Pas encore fournis par l'API : à revoir quand on branchera le service.
  statut: StatutEntreprise;
  nbContacts: number;
}
