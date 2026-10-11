import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Entreprise, EntrepriseInput } from '../utils/models/entreprise';

const URL_ENTREPRISES = `${environment.apiUrl}/entreprises`;

@Service()
export class EntreprisesService {
  private readonly http = inject(HttpClient);

  // GET /api/entreprises, lancé dès que le service est utilisé pour la première fois.
  private readonly ressource = httpResource<Entreprise[]>(() => URL_ENTREPRISES);

  // Chargement de la liste (GET)
  // Liste vide pendant le chargement et en cas d'erreur : lire value() en erreur lancerait une exception.
  readonly entreprises = computed(() => (this.ressource.hasValue() ? this.ressource.value() : []));
  readonly isLoading = this.ressource.isLoading;
  readonly error = this.ressource.error;

  async ajouter(entreprise: EntrepriseInput): Promise<void> {
    await firstValueFrom(this.http.post<Entreprise>(URL_ENTREPRISES, entreprise));
    this.ressource.reload();
  }

  async modifier(id: number, entreprise: EntrepriseInput): Promise<void> {
    await firstValueFrom(this.http.put<Entreprise>(`${URL_ENTREPRISES}/${id}`, entreprise));
    this.ressource.reload();
  }

  async supprimer(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${URL_ENTREPRISES}/${id}`));
    this.ressource.reload();
  }
}
