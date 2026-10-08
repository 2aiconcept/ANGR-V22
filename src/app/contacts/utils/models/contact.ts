export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise_id: number | null;
}
