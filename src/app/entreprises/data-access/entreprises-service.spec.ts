import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Entreprise } from '../utils/models/entreprise';
import { EntreprisesService } from './entreprises-service';

const URL_ENTREPRISES = `${environment.apiUrl}/entreprises`;

const TECHVISION: Entreprise = {
  id: 1,
  nom: 'TechVision',
  secteur: 'IT & Cloud',
  adresse: "12 rue de l'Innovation, 75011 Paris",
  telephone: '01 45 67 89 00',
};

describe('EntreprisesService', () => {
  let service: EntreprisesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EntreprisesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  // httpResource() envoie sa requête au premier cycle de rendu : on le déclenche.
  function lancerLaRequete() {
    TestBed.inject(ApplicationRef).tick();
    return httpTesting.expectOne({ method: 'GET', url: URL_ENTREPRISES });
  }

  it('renvoie une liste vide et indique le chargement tant que l’API n’a pas répondu', () => {
    lancerLaRequete();

    expect(service.entreprises()).toEqual([]);
    expect(service.isLoading()).toBe(true);
  });

  it('charge les entreprises depuis GET /api/entreprises', async () => {
    lancerLaRequete().flush([TECHVISION]);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.entreprises()).toEqual([TECHVISION]);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeUndefined();
  });

  it("signale une erreur et renvoie une liste vide si l'API ne répond pas", async () => {
    lancerLaRequete().flush('Erreur serveur', {
      status: 500,
      statusText: 'Internal Server Error',
    });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.error()).toBeDefined();
    expect(service.entreprises()).toEqual([]);
  });
});
