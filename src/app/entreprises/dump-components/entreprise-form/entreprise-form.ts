import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Entreprise, EntrepriseInput } from '../../utils/models/entreprise';

// Dans le formulaire, chaque champ existe toujours : une chaîne vide quand rien n'est saisi.
interface ValeursFormulaire {
  nom: string;
  secteur: string;
  adresse: string;
  telephone: string;
}

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-entreprise-form',
  styleUrl: './entreprise-form.scss',
  templateUrl: './entreprise-form.html',
})
export class EntrepriseForm {
  // Absent : création. Présent : modification, les champs sont pré-remplis.
  readonly entreprise = input<Entreprise>();
  readonly isEnregistrementEnCours = input(false);

  readonly enregistrer = output<EntrepriseInput>();
  readonly annuler = output<void>();

  // Les valeurs saisies. Repart des valeurs de l'entreprise reçue à chaque changement de l'input.
  private readonly valeurs = linkedSignal<ValeursFormulaire>(() => ({
    nom: this.entreprise()?.nom ?? '',
    secteur: this.entreprise()?.secteur ?? '',
    adresse: this.entreprise()?.adresse ?? '',
    telephone: this.entreprise()?.telephone ?? '',
  }));

  protected readonly formulaire = form(
    this.valeurs,
    (champ) => {
      required(champ.nom, { message: 'Le nom est obligatoire.' });
    },
    {
      submission: {
        // Appelée par [formRoot] uniquement si le formulaire est valide.
        action: async () => {
          this.enregistrer.emit(this.valeurs());
          return undefined;
        },
      },
    },
  );
}
