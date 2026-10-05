# API Mini-CRM : endpoints et modèles de données

Source : spec OpenAPI de l'API (`/api-docs`, version 1.2.0), vérifiée contre les vraies réponses `GET` le 2026-10-05.

- **URL de base** : `https://mini-crm-api-production-298d.up.railway.app`
- **Swagger** : https://mini-crm-api-production-298d.up.railway.app/api-docs
- **Format** : JSON (`Content-Type: application/json`)
- **CORS** : ouvert (`Access-Control-Allow-Origin: *`), appelable directement depuis `http://localhost:4200`
- **Données** : base en mémoire, partagée entre tous les stagiaires, réinitialisée chaque dimanche à 8 h (Europe/Paris)
- **Authentification** : modèles définis ci-dessous (1.1), mais **l'API déployée n'expose aucun endpoint d'authentification** (voir 2.0).

---

## 1. Modèles de données

Les noms de champs sont en `snake_case`, comme dans l'API. Ces modèles sont la référence pour les interfaces TypeScript du projet.

### 1.1 Authentification

```ts
export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'user' | 'admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  nom: string;
  prenom: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

### 1.2 Entreprise

```ts
export interface Entreprise {
  id: number;
  nom: string;
  secteur?: string;
  adresse?: string;
  telephone?: string;
}

export type EntrepriseInput = Omit<Entreprise, 'id'>;
```

Obligatoire côté API : `nom`.

```json
{ "id": 1, "nom": "TechVision", "secteur": "IT & Cloud", "adresse": "12 rue de l'Innovation, 75011 Paris", "telephone": "01 45 67 89 00" }
```

### 1.3 Contact

```ts
export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise_id: number | null;
}

export type ContactInput = Omit<Contact, 'id'>;
```

Obligatoires côté API : `nom`, `prenom`, `email`. `entreprise_id` doit désigner une entreprise existante (sinon `400`).

```json
{ "id": 1, "nom": "Dupont", "prenom": "Marie", "email": "marie.dupont@techvision.fr", "telephone": "06 12 34 56 78", "entreprise_id": 1 }
```

### 1.4 Opportunité

```ts
export type StatutOpportunite = 'Prospect' | 'En cours' | 'Gagné' | 'Perdu';

export interface Opportunite {
  id: number;
  titre: string;
  description: string;
  montant: number;      // en euros
  statut: StatutOpportunite;
  contact_id: number | null;
  entreprise_id: number | null;
}

export type OpportuniteInput = Omit<Opportunite, 'id'>;
```

Obligatoire côté API : `titre`. `contact_id` et `entreprise_id` doivent exister (sinon `400`).

```json
{ "id": 3, "titre": "App Mobile ShopNow", "description": "Développement d'une application mobile e-commerce React Native", "montant": 200000, "statut": "Gagné", "contact_id": 4, "entreprise_id": 3 }
```

> **Accent de « Gagné »** : la spec Swagger écrit `Gagne` (sans accent), mais l'API renvoie réellement `"Gagné"`. On utilise `'Gagné'`.

### 1.5 Dashboard

```ts
export interface DashboardStats {
  contacts: number;
  entreprises: number;
  opportunites: number;
  montant_total: number;
}
```

### 1.6 Erreur

```ts
export interface ApiErreur {
  error: string;
  message?: string;
  champs_manquants?: string[];
}
```

Exemples réels :

```json
// 404 : GET sur un id inexistant
{ "error": "Contact avec l'id 99999 non trouvé" }

// 400 : id non entier
{ "error": "L'identifiant doit être un nombre entier" }

// 400 : POST /api/contacts avec {}
{ "error": "Champs obligatoires manquants", "champs_manquants": ["nom", "prenom", "email"],
  "exemple": { "nom": "Dupont", "prenom": "Marie", "email": "marie@exemple.fr" } }

// 404 : route inconnue
{ "error": "Route non trouvée", "conseil": "Consultez GET / pour la liste des endpoints disponibles" }
```

L'API ajoute parfois `exemple` ou `conseil`, qui ne servent qu'à l'aide au débogage : on ne les type pas.

### 1.7 Réponse d'un DELETE

```json
{ "message": "...", "<entité>": { /* l'objet supprimé */ } }
```

Un message de confirmation, et l'objet supprimé. Le nom exact de la clé de l'objet n'a pas été vérifié.

---

## 2. Endpoints

### 2.0 Authentification : non disponible

Les modèles `LoginInput`, `RegisterInput` et `AuthResponse` (1.1) sont prévus, mais l'API déployée ne fournit aucun endpoint correspondant. Testé le 2026-10-05, toutes ces routes répondent `404 Route non trouvée` :

- `POST` : `/api/auth/login`, `/api/auth/register`, `/api/auth/signin`, `/api/auth/signup`, `/api/login`, `/api/register`, `/api/users/login`
- `GET` : `/api/auth/me`, `/api/auth/profile`, `/api/me`

Aucun autre endpoint n'exige de jeton. Tant que l'API n'a pas d'authentification, la connexion doit être simulée côté front, ou attendre une autre API.

### 2.1 Entreprises

| Méthode | URL | Corps envoyé | Réponse | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/entreprises` | — | `200` `Entreprise[]` | — |
| `GET` | `/api/entreprises/:id` | — | `200` `Entreprise` | `400` id non entier, `404` |
| `POST` | `/api/entreprises` | `EntrepriseInput` | `201` `Entreprise` (avec son `id`) | `400` `nom` manquant |
| `PUT` | `/api/entreprises/:id` | `EntrepriseInput` | `200` `Entreprise` | `404` |
| `DELETE` | `/api/entreprises/:id` | — | `200` `{ message, <objet supprimé> }` | `404` |
| `GET` | `/api/entreprises/:id/contacts` | — | `200` `Contact[]` (contacts de l'entreprise) | `404` |

### 2.2 Contacts

| Méthode | URL | Corps envoyé | Réponse | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/contacts` | — | `200` `Contact[]` | — |
| `GET` | `/api/contacts/:id` | — | `200` `Contact` | `400` id non entier, `404` |
| `POST` | `/api/contacts` | `ContactInput` | `201` `Contact` | `400` champ obligatoire manquant ou `entreprise_id` invalide |
| `PUT` | `/api/contacts/:id` | `Partial<ContactInput>` | `200` `Contact` | `404` |
| `DELETE` | `/api/contacts/:id` | — | `200` `{ message, <objet supprimé> }` | `404` |
| `GET` | `/api/contacts/:id/opportunites` | — | `200` `Opportunite[]` (opportunités du contact) | `404` |

### 2.3 Opportunités

| Méthode | URL | Corps envoyé | Réponse | Erreurs |
|---|---|---|---|---|
| `GET` | `/api/opportunites` | — | `200` `Opportunite[]` | — |
| `GET` | `/api/opportunites/:id` | — | `200` `Opportunite` | `400` id non entier, `404` |
| `POST` | `/api/opportunites` | `OpportuniteInput` | `201` `Opportunite` | `400` `titre` manquant ou `contact_id` / `entreprise_id` invalide |
| `PUT` | `/api/opportunites/:id` | `Partial<OpportuniteInput>` | `200` `Opportunite` | `404` |
| `DELETE` | `/api/opportunites/:id` | — | `200` `{ message, <objet supprimé> }` | `404` |

`PUT` est une **mise à jour partielle** : seuls les champs envoyés sont modifiés (documenté pour contacts et opportunités). Dans l'appli, le formulaire envoie l'objet complet (`XxxInput`), ce qui fonctionne aussi.

Toutes les erreurs ont la forme `ApiErreur` (1.6).

### 2.4 Dashboard et administration

| Méthode | URL | Réponse |
|---|---|---|
| `GET` | `/` | Infos de l'API et liste des endpoints |
| `GET` | `/api/dashboard/stats` | `200` `DashboardStats` |
| `GET` | `/api/health` | `200` état de l'API (uptime, compteurs, dernière activité) |
| `GET` | `/api/admin/stats` | `200` stats détaillées (par secteur, par statut, prochain reset) |
| `POST` | `/api/admin/reset-formation` | `200` `{ "message": "..." }` : **remet toutes les données à zéro pour tout le monde** |

```json
// GET /api/admin/stats
{
  "contacts": { "total": 5, "avec_entreprise": 5, "sans_entreprise": 0 },
  "entreprises": { "total": 4, "par_secteur": { "IT & Cloud": 1, "Conseil": 1, "E-commerce": 1, "Fintech": 1 } },
  "opportunites": { "total": 4, "montant_total": 383000, "montant_moyen": 95750,
                    "par_statut": { "En cours": 1, "Prospect": 1, "Gagné": 1, "Perdu": 1 } },
  "derniere_activite": "2026-10-04T06:00:00.496Z",
  "prochain_reset": "Dimanche 08h00 (Europe/Paris)"
}
```

---

## 3. Non vérifié

Ces points n'ont pas été testés, pour ne pas modifier les données partagées :
- le nom exact de la clé qui contient l'objet supprimé dans la réponse d'un `DELETE` ;
- le message `400` quand `entreprise_id` ou `contact_id` n'existe pas, et la présence du champ `message` dans une erreur ;
- ce qui arrive aux contacts et opportunités liés quand on supprime une entreprise ou un contact.

---

## 4. Écarts avec `documentation.md`

Voir la section 7.2 de `documentation.md` : authentification, statut d'entreprise, date de clôture.
