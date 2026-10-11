import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Entreprise } from '../utils/models/entreprise';

const URL_ENTREPRISES = `${environment.apiUrl}/entreprises`;

@Service()
export class EntreprisesService {
  // GET /api/entreprises, lancé dès que le service est utilisé pour la première fois.
  private readonly ressource = httpResource<Entreprise[]>(() => URL_ENTREPRISES);

  // Chargement de la liste (GET)
  // Liste vide pendant le chargement et en cas d'erreur : lire value() en erreur lancerait une exception.
  readonly entreprises = computed(() => (this.ressource.hasValue() ? this.ressource.value() : []));
  readonly isLoading = this.ressource.isLoading;
  readonly error = this.ressource.error;
}
