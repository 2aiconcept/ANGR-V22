export interface Entreprise {
  id: number;
  nom: string;
  secteur?: string;
  adresse?: string;
  telephone?: string;
}

// Ce qu'on envoie à l'API pour créer ou modifier : tout sauf l'id, attribué par le serveur.
export type EntrepriseInput = Omit<Entreprise, 'id'>;
