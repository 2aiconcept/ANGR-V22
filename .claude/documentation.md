# Architecture du frontend Angular — Mini-CRM

Ce document décrit l'architecture retenue pour le frontend Angular 22 du Mini-CRM : l'organisation des dossiers, le routage, et le rôle de chaque composant et de chaque service. Il sert de référence à l'agent codeur comme aux développeurs.

Il décrit l'architecture **cible**. Ce qui est déjà créé dans le code est indiqué en section 10. Les endpoints et modèles de l'API sont dans `endpoints-et-donnees.md`.

---

## 1. Principes

- **Découpage par métier.** Chaque domaine métier (`auth`, `entreprises`, `contacts`, `opportunites`) a son propre dossier. Un service ou un modèle vit dans le dossier de **son** domaine, même si d'autres features l'utilisent : il ne déménage jamais dans `shared/` pour cette raison.
- **`shared/` ne connaît aucun métier.** On n'y met que du générique (tableau, modale, pagination…), qui ne sait pas ce qu'est une entreprise ou une opportunité. Le code transverse lié à la mise en page est dans `layout/`.
- **Trois dossiers par feature :**
  - `data-access/` : le service qui appelle l'API et porte l'état du domaine, et les modèles du domaine ;
  - `smart-components/` : les pages routées, qui lisent l'état et orchestrent ;
  - `dump-components/` (composants « dumb » ; le dossier s'écrit `dump` dans le projet) : les composants d'affichage, qui ne reçoivent que des `input()` et n'émettent que des `output()`. Aucun accès au service, aucun appel HTTP.
- **Un smart component par page.** Seuls les smart components injectent des services : celui de leur feature, celui d'une autre feature ou celui de `shared/`. Ils croisent les données de plusieurs domaines si besoin (ex. : nombre d'opportunités par entreprise, voir 1.1), les passent aux dumb components et réagissent à leurs événements.
- **Standalone, Signals, OnPush, zoneless.** Aucun `NgModule`. Contrôle de flux en `@if` / `@for` / `@switch`. Injection par `inject()`.
- **Pas de composant sans comportement.** Un titre de page, un texte ou un simple conteneur se font en HTML avec des classes globales. Un composant n'est créé que s'il porte un comportement, ou un bloc réutilisé à plusieurs endroits.
- **Réutilisation par contrat, pas par type.** Un composant de `shared/` ne connaît aucune entité métier : il ne sait pas ce qu'est une entreprise. Chaque page lui fournit ses données et, si besoin, ses templates.

### 1.1 Règles de dépendance

| Qui | Peut importer | Ne peut pas importer |
|---|---|---|
| `<feature>/smart-components` | `data-access` de sa feature **et des autres features**, ses propres dumb, `shared/`, `layout/` | les composants (smart ou dumb) d'une autre feature |
| `<feature>/dump-components` | les modèles (interfaces) de sa feature ou d'une autre (ex. : `opportunite-form` reçoit des `Entreprise[]`), `shared/` | aucun service, ni router ni HTTP |
| `<feature>/data-access` | `HttpClient`, ses propres modèles | le service d'une autre feature |
| `shared/` | rien du métier | aucune feature |

```
entreprises/smart-components  ──►  opportunites/data-access   ✅ une page lit un autre domaine
entreprises/data-access       ──►  opportunites/data-access   ❌ deux services liés entre eux
shared/                       ──►  n'importe quelle feature    ❌ shared ne connaît pas le métier
entreprises/smart-components  ──►  opportunites/dump-components ❌ casse le lazy loading
```

Comme un service ne dépend que de l'API, aucun cycle n'est possible. Le lazy loading reste efficace : le builder suit les `import`, pas les dossiers. Un service partagé par deux pages part dans un petit chunk commun, et les pages restent chacune dans leur chunk.

Les services d'une feature ne sont **jamais fournis ni référencés dans `app.config.ts`** : ce fichier fait partie du bundle initial, et le service y serait chargé sur toutes les pages, `/connexion` comprise. `@Service()` suffit, car Angular le fournit à la demande.

Exemple, le nombre d'opportunités par entreprise. L'API n'a pas d'endpoint dédié, mais chaque opportunité a un `entreprise_id`. `EntreprisesPage` injecte donc `EntreprisesService` et `OpportunitesService`, et compte avec un `computed()` :

```ts
protected readonly nbOpportunitesParEntreprise = computed(() => {
  const compteur = new Map<number, number>();
  for (const opportunite of this.opportunitesService.opportunites()) {
    if (opportunite.entreprise_id !== null) {
      compteur.set(opportunite.entreprise_id, (compteur.get(opportunite.entreprise_id) ?? 0) + 1);
    }
  }
  return compteur;
});
```

Ces règles correspondent aux contraintes de modules de Nx (`feature` → `data-access` autorisé, `data-access` → `data-access` interdit), vues en formation Angular avancé.

---

## 2. Arborescence

```
src/app/
├─ app.ts / app.html            ← un seul <router-outlet />
├─ app.config.ts                ← provideRouter(routes, withComponentInputBinding())
├─ app.routes.ts
│
├─ auth/
│  ├─ data-access/
│  │  └─ auth-service.ts
│  ├─ smart-components/
│  │  └─ auth-page/
│  ├─ dump-components/
│  │  └─ auth-form/
│  └─ auth.guard.ts             ← authGuard et guestGuard
│
├─ entreprises/
│  ├─ data-access/
│  │  └─ entreprises-service.ts
│  ├─ smart-components/
│  │  └─ entreprises-page/
│  ├─ dump-components/
│  │  └─ entreprise-form/
│  └─ entreprises.routes.ts
│
├─ contacts/
│  ├─ data-access/
│  │  └─ contacts-service.ts
│  ├─ smart-components/
│  │  └─ contacts-page/
│  ├─ dump-components/
│  │  └─ contact-form/
│  └─ contacts.routes.ts
│
├─ opportunites/
│  ├─ data-access/
│  │  └─ opportunites-service.ts
│  ├─ smart-components/
│  │  ├─ opportunites-page/
│  │  └─ opportunite-form-page/
│  ├─ dump-components/
│  │  └─ opportunite-form/
│  └─ opportunites.routes.ts
│
├─ layout/
│  ├─ smart-components/
│  │  └─ app-shell/
│  └─ dump-components/
│     ├─ app-header/
│     ├─ main-nav/
│     ├─ user-badge/
│     └─ logout-button/
│
└─ shared/
   └─ dump-components/
      ├─ list-page-layout/
      ├─ split-layout/
      ├─ side-panel/
      ├─ modal/
      ├─ data-table/
      ├─ segmented-control/
      ├─ password-field/
      ├─ stat-card/
      ├─ search-field/
      ├─ filter-chips/
      ├─ status-badge/
      ├─ avatar-initials/
      └─ paginator/
```

---

## 3. Routage

### 3.1 Les routes

```ts
// app.routes.ts
export const routes: Routes = [
  { path: 'connexion', title: 'Connexion', canActivate: [guestGuard],
    loadComponent: () => import('./auth/smart-components/auth-page/auth-page').then(m => m.AuthPage) },

  { path: '', component: AppShell, canActivate: [authGuard], children: [
      { path: 'entreprises',
        loadChildren: () => import('./entreprises/entreprises.routes').then(m => m.ENTREPRISES_ROUTES) },
      { path: 'contacts',
        loadChildren: () => import('./contacts/contacts.routes').then(m => m.CONTACTS_ROUTES) },
      { path: 'opportunites',
        loadChildren: () => import('./opportunites/opportunites.routes').then(m => m.OPPORTUNITES_ROUTES) },
      { path: '', redirectTo: 'entreprises', pathMatch: 'full' },
  ]},

  { path: '**', redirectTo: '' },
];
```

Chaque feature du shell a son fichier de routes. `app.routes.ts` ne connaît que le préfixe (`entreprises`, `contacts`, `opportunites`) ; le reste est décidé dans la feature.

```ts
// entreprises/entreprises.routes.ts
export const ENTREPRISES_ROUTES: Routes = [
  { path: '', title: 'Entreprises', loadComponent: () => import('./smart-components/entreprises-page/entreprises-page').then(m => m.EntreprisesPage) },
];

// contacts/contacts.routes.ts
export const CONTACTS_ROUTES: Routes = [
  { path: '', title: 'Contacts', loadComponent: () => import('./smart-components/contacts-page/contacts-page').then(m => m.ContactsPage) },
];

// opportunites/opportunites.routes.ts
export const OPPORTUNITES_ROUTES: Routes = [
  { path: '', title: 'Opportunités', loadComponent: () => import('./smart-components/opportunites-page/opportunites-page').then(m => m.OpportunitesPage) },
  { path: 'nouvelle', title: 'Nouvelle opportunité', loadComponent: () => import('./smart-components/opportunite-form-page/opportunite-form-page').then(m => m.OpportuniteFormPage) },
  { path: ':id/modifier', title: 'Modifier une opportunité', loadComponent: () => import('./smart-components/opportunite-form-page/opportunite-form-page').then(m => m.OpportuniteFormPage) },
];
```

Chaque route de page a un `title` : Angular l'affiche dans l'onglet et le lecteur d'écran l'annonce à chaque navigation. Les routes `''` (shell), les redirections et `**` n'en ont pas, car ce ne sont pas des pages.

### 3.2 Le layout est choisi par le router

Deux layouts coexistent, et c'est la configuration des routes qui décide lequel s'affiche :

| Adresse | `router-outlet` de `app.html` | `router-outlet` de `app-shell.html` |
|---|---|---|
| `/connexion` | `AuthPage` | — (le shell n'est pas affiché) |
| `/entreprises` | `AppShell` | `EntreprisesPage` |
| `/contacts` | `AppShell` | `ContactsPage` |
| `/opportunites/3/modifier` | `AppShell` | `OpportuniteFormPage` |

- `AppComponent` ne contient qu'un `<router-outlet />`. Il ne connaît pas l'état de connexion.
- `AppShell` contient le header et un second `<router-outlet />`, qui affiche la page enfant. En passant d'une page à l'autre, seul ce second outlet change : le header n'est ni détruit ni recréé.

### 3.3 Les guards

| Guard | Placé sur | Rôle |
|---|---|---|
| `authGuard` | la route parente `''` (`AppShell`) | Un utilisateur non connecté est redirigé vers `/connexion`. Déclaré une seule fois, il protège toutes les pages enfants. |
| `guestGuard` | `/connexion` | Un utilisateur déjà connecté est redirigé vers `/entreprises`. |

Au démarrage avec une adresse vide, le guard s'exécute **avant** l'affichage : l'utilisateur non connecté arrive sur `/connexion`, l'utilisateur connecté sur `/entreprises`. Une adresse inconnue renvoie vers `''` et repasse par le même contrôle.

### 3.4 Lazy loading

- `loadChildren` pour les features du shell (`entreprises`, `contacts`, `opportunites`) : chacune a son fichier `<feature>.routes.ts`, même avec une seule page, pour pouvoir ajouter des routes sans toucher à `app.routes.ts`. `loadComponent` pour `auth`, seule page hors du shell.
- Le lazy loading passe obligatoirement par un `import()` dynamique. Référencer un tableau de routes importé en haut du fichier ne diffère rien.
- `AppShell` et les guards restent dans le bundle principal : ils servent sur toutes les pages, ou avant tout chargement.
- `AuthPage` est chargée à la demande : un commercial qui revient avec une session encore valide ne la télécharge jamais.

### 3.5 Paramètre de route

`withComponentInputBinding()` est activé dans `app.config.ts`. Le paramètre `:id` arrive directement comme un `input()` du composant de page, et vaut `undefined` sur la route `nouvelle`. Une même page sert donc à la création et à la modification.

---

## 4. Les features

### 4.1 `auth/`

| Élément | Type | Rôle |
|---|---|---|
| `auth-service.ts` | data-access | Connexion, inscription, déconnexion. Garde l'utilisateur courant et le jeton JWT. Expose `user()` et `isLogged()` en signals, utilisés par les guards et par `AppShell`. |
| `auth-page` | smart | Page `/connexion`. Utilise `SplitLayout` : texte de présentation à gauche, formulaire à droite. Gère l'onglet actif (connexion ou inscription), appelle le service et redirige vers `/entreprises` après succès. |
| `auth-form` | dumb | Un seul formulaire pour les deux cas, selon un input `mode` (`'signin'` ou `'signup'`). En inscription, il affiche en plus le nom et la confirmation du mot de passe, et active les règles de robustesse du mot de passe. Émet les valeurs saisies. |
| `auth.guard.ts` | — | `authGuard` et `guestGuard`, voir 3.3. |

### 4.2 `entreprises/`

| Élément | Type | Rôle |
|---|---|---|
| `entreprises-service.ts` | data-access | Liste, création et modification des entreprises (`GET`, `POST`, `PUT`). Porte la liste en état et les valeurs calculées pour les statistiques. |
| `entreprises-page` | smart | Page `/entreprises`. Utilise `ListPageLayout`. Gère la recherche, le filtre de statut, la page courante, et l'ouverture du `SidePanel` d'ajout ou de modification. |
| `entreprise-form` | dumb | Formulaire d'une entreprise : nom, secteur, adresse, téléphone, statut (`Actif` / `Inactif` via `SegmentedControl`). Reçoit la valeur initiale, émet la valeur saisie. |

Le formulaire s'affiche dans un **panneau latéral** (`SidePanel`), sans changement de route : la page contient le panneau dans un `@if`, piloté par un signal `editing` (`null`, `'new'` ou l'entreprise à modifier).

### 4.3 `contacts/`

| Élément | Type | Rôle |
|---|---|---|
| `contacts-service.ts` | data-access | Liste, création et modification des contacts. |
| `contacts-page` | smart | Page `/contacts`. Même structure que la page Entreprises, mais le formulaire s'ouvre dans une **popup** (`Modal`). |
| `contact-form` | dumb | Formulaire d'un contact : prénom, nom, e-mail, téléphone, entreprise de rattachement. |

### 4.4 `opportunites/`

| Élément | Type | Rôle |
|---|---|---|
| `opportunites-service.ts` | data-access | Liste, création et modification des opportunités. Calcule le pipeline ouvert et le montant gagné. |
| `opportunites-page` | smart | Page `/opportunites`. Liste avec statistiques, recherche et filtre par statut. |
| `opportunite-form-page` | smart | Pages `/opportunites/nouvelle` et `/opportunites/:id/modifier`. Reçoit `id` en input, distingue création et modification, gère le cas d'une opportunité introuvable, enregistre puis revient à la liste. |
| `opportunite-form` | dumb | Formulaire d'une opportunité : intitulé, entreprise, contact (filtré selon l'entreprise choisie), montant, date de clôture, statut, notes. Ne sait pas s'il crée ou s'il modifie. |

Ici, le formulaire est sur **une page dédiée** : c'est la seule feature qui a plusieurs routes.

Statuts : `'Prospect' | 'En cours' | 'Gagné' | 'Perdu'`, `Prospect` par défaut.

---

## 5. `layout/`

| Élément | Type | Rôle |
|---|---|---|
| `app-shell` | smart | Layout des pages connectées. Affiche `AppHeader` et un `<router-outlet />` pour la page enfant. Lit l'utilisateur dans `AuthService` et déclenche la déconnexion. |
| `app-header` | dumb | La barre bleu marine : logo, navigation, badge utilisateur, bouton de déconnexion. Reçoit `user`, émet `logout`. |
| `main-nav` | dumb | Les liens Entreprises, Contacts, Opportunités, avec `routerLinkActive` pour la page courante. |
| `user-badge` | dumb | Le cercle avec les initiales, le prénom et le nom. Utilise `AvatarInitials`. |
| `logout-button` | dumb | Le bouton « Déconnexion ». Émet un événement, ne fait pas l'appel lui-même. |

---

## 6. `shared/` — composants réutilisables

### 6.1 Les layouts et conteneurs (par projection)

Ces composants ne contiennent que de la structure et des zones `<ng-content>`. Ils ne savent pas ce qu'on y met.

| Composant | Zones de projection | Utilisé par |
|---|---|---|
| `list-page-layout` | `[pageHeader]`, `[pageKpis]`, `[pageToolbar]`, contenu par défaut, `[pageFooter]` | les trois pages de liste |
| `split-layout` | `[splitLeft]`, `[splitRight]` | la page de connexion |
| `side-panel` | `[panelHeader]`, contenu par défaut, `[panelFooter]` | le formulaire des entreprises |
| `modal` | `[modalHeader]`, contenu par défaut, `[modalFooter]` | le formulaire des contacts |

`side-panel` et `modal` ont la même interface (input `open`, output `closed`, fermeture par la touche Échap et par clic sur le fond grisé). Seul le placement change : à droite en pleine hauteur, ou centré.

Exemple d'utilisation :

```html
<app-list-page-layout>
  <div pageHeader>
    <div>
      <p class="page-eyebrow">Portefeuille commercial</p>
      <h1 class="page-title">Entreprises</h1>
    </div>
    <button type="button" class="btn btn-primary" (click)="editing.set('new')">Nouvelle entreprise</button>
  </div>
  <div pageKpis> @for (s of stats(); track s.label) { <app-stat-card [label]="s.label" [value]="s.value" [color]="s.color" /> } </div>
  <div pageToolbar> <app-search-field … /> <app-filter-chips … /> </div>
  <app-data-table [columns]="columns" [rows]="rows()" … />
  <div pageFooter> <app-paginator … /> </div>
</app-list-page-layout>

@if (editing()) {
  <app-side-panel [open]="true" (closed)="editing.set(null)">
    <div panelHeader>…</div>
    <app-entreprise-form [value]="formValue()" (submitted)="save($event)" />
    <div panelFooter>…</div>
  </app-side-panel>
}
```

### 6.2 Les composants d'affichage

| Composant | Où dans le design | Contrat |
|---|---|---|
| `data-table` | les tableaux des trois listes | Reçoit les colonnes et les lignes. Les cellules qui ne sont pas du texte simple (avatar, badge, montant, bouton Modifier) sont fournies par la page en `ng-template`. Le composant ne contient aucun `@if` sur un type d'entité. |
| `segmented-control` | « Connexion \| Créer un compte », « Actif \| Inactif », « Prospect \| En cours \| Gagné \| Perdu » | Groupe de boutons collés, une seule option sélectionnée. Reçoit les options et la valeur, émet la valeur choisie. |
| `password-field` | les champs mot de passe | Champ avec le bouton « Afficher / Masquer ». Seul champ de formulaire transformé en composant, parce qu'il porte un comportement. Se branche sur le formulaire comme un champ natif. |
| `stat-card` | les quatre cartes de chiffres sous le titre | Reçoit un libellé, une valeur et une couleur. |
| `search-field` | la barre de recherche | Champ avec icône. Émet le texte saisi. |
| `filter-chips` | les filtres en pastilles (Toutes, Actives, Inactives…) | Reçoit les options et l'option active, émet l'option choisie. |
| `status-badge` | les pastilles de statut dans les tableaux | Reçoit le statut, applique la couleur correspondante. |
| `avatar-initials` | le carré ou le cercle d'initiales (entreprises, contacts, utilisateur) | Reçoit un nom, calcule les initiales. Variante carrée ou ronde. |
| `paginator` | la pagination en bas des listes | Reçoit la page courante et le nombre de pages, émet la page choisie. |

### 6.3 Ce qui n'est pas un composant

- **Les champs de formulaire simples** (texte, e-mail, liste déroulante, zone de texte) : des éléments HTML natifs, mis en forme par les classes Bootstrap et les classes globales de `styles.scss`.
- **Le titre de page** : un `<p class="page-eyebrow">` et un `<h1 class="page-title">`.
- **Les boutons d'action** : un élément `<button>` natif avec les classes Bootstrap (`btn btn-primary`, `btn btn-outline-secondary`, `btn btn-link`).

Règle générale : la mise en forme passe par les classes Bootstrap dans les templates. Le SCSS custom (global ou de composant) est réservé à ce que Bootstrap ne couvre pas.

---

## 7. Décisions et points ouverts

### 7.1 Décidé : des services, pas de store

Formation **Angular initiation** : chaque `data-access/` contient un **service** (`@Service()`) qui fait les appels HTTP et porte l'état en signals. Pas de NgRx, pas de Signal Store, pas de Nx. L'application sera transformée plus tard, dans la formation Angular avancé.

### 7.2 À trancher : écarts entre ce document et l'API

L'API (voir `endpoints-et-donnees.md`) ne fournit pas tout ce que ce document prévoit :

| Prévu ici | Ce que fait l'API |
|---|---|
| `auth/` : connexion, inscription, JWT, guards (3.3, 4.1) | Aucun endpoint d'authentification, aucun jeton |
| Entreprise : statut `Actif` / `Inactif` (4.2, filtres « Actives / Inactives ») | Pas de champ statut sur une entreprise |
| Opportunité : date de clôture et notes (4.4) | Pas de date ; le champ `description` tient lieu de notes |
| Opportunité : intitulé | Le champ s'appelle `titre` |

Bootstrap (cité en 6.3) est installé depuis l'étape 3 (voir section 10).

---

## 8. Le dossier `.claude/`

Le dossier `.claude/` à la racine du dépôt contient les documents que Claude Code charge au début de chaque conversation :

```
.claude/
├─ CLAUDE.md                ← règles de codage ; importe les deux fichiers ci-dessous
├─ documentation.md         ← ce document : architecture et composants
└─ endpoints-et-donnees.md  ← endpoints de l'API, données envoyées et reçues
```

`CLAUDE.md` est lu automatiquement par Claude Code. Il importe les deux autres fichiers avec la syntaxe `@nom-du-fichier.md`, ce qui les charge aussi dès l'ouverture d'une conversation.

Prévu au fil de la formation (pas encore créé) :
- `design/` : les maquettes HTML, source de vérité pour le rendu (couleurs, espacements, états, mobile) ;
- `support-de-cours/` : les slides et guides de la formation, pour que l'agent applique les conventions enseignées.

En cas de contradiction entre une maquette et ce document, ce document l'emporte pour la structure, et la maquette pour le rendu.

---

## 9. Les serveurs MCP

Deux serveurs MCP (Model Context Protocol) donnent à l'assistant IA des outils en plus de la lecture du code.

| Serveur | Paquet | À quoi il sert |
|---|---|---|
| `angular-cli` | `@angular/cli` (commande `ng mcp`) | Donne accès à la documentation officielle d'Angular, aux bonnes pratiques et à des exemples de code à jour, pour que l'assistant écrive du code Angular 22 plutôt que d'anciennes syntaxes. Connaît aussi la structure du workspace (`angular.json`). |
| `playwright` | `@playwright/mcp` | Pilote un vrai navigateur : ouvrir l'appli sur `http://localhost:4200`, cliquer, remplir un formulaire, lire la page. Sert à vérifier un rendu, reproduire un bug et écrire les tests e2e. |

### 9.1 Configuration

Chaque outil lit son propre fichier :

| Fichier | Lu par | Clé racine |
|---|---|---|
| `.vscode/mcp.json` | VS Code (mode agent de Copilot Chat) | `servers` |
| `.mcp.json` (racine du dépôt) | Claude Code | `mcpServers` |

Dans `.mcp.json`, `npx` est lancé via `cmd /c` (`"command": "cmd", "args": ["/c", "npx", …]`) : sous Windows, Claude Code ne trouve pas `npx` directement.

```json
// .vscode/mcp.json
{
  "servers": {
    "angular-cli": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

- `-y` évite que `npx` attende une confirmation au premier téléchargement du paquet, ce qui bloquerait le démarrage du serveur.
- `npx @angular/cli` utilise la version du CLI installée dans le projet, donc la même version d'Angular que l'appli.
- Le serveur `playwright` télécharge un navigateur au premier lancement s'il n'y en a pas.

---

## 10. État d'avancement

Mis à jour à chaque étape de la formation.

### Étape 1 (branche `branche-1`) : squelette

Composants et services générés, **encore vides** (pas d'input, d'output, de logique ni de template) :

| Dossier | Créé |
|---|---|
| `auth/` | `auth-service`, `auth-page`, `auth-form` |
| `entreprises/` | `entreprises-service`, `entreprises-page`, `entreprise-form` |
| `contacts/` | `contacts-service`, `contacts-page`, `contact-form` |
| `opportunites/` | `opportunites-service`, `opportunites-page`, `opportunite-form` |
| `shared/dump-components/` | `avatar-initials`, `data-table`, `filter-chips`, `list-page-layout`, `modal`, `paginator`, `password-field`, `search-field`, `segmented-control`, `side-panel`, `split-layout`, `stat-card`, `status-badge` |

Pas encore créé :
- `layout/` (`app-shell`, `app-header`, `main-nav`, `user-badge`, `logout-button`) ;
- `auth.guard.ts`, `opportunites.routes.ts`, `opportunite-form-page` ;
- les routes : `app.routes.ts` est vide, et `withComponentInputBinding()` n'est pas encore dans `app.config.ts`.

### Étape 2 (branche `branche-2`) : routage et shell

| Élément | État |
|---|---|
| `app.routes.ts` | `connexion` (hors shell), puis `''` → `AppShell` avec `entreprises`, `contacts`, `opportunites` en `loadChildren`, redirection `''` → `entreprises`, `**` → `''` |
| `entreprises.routes.ts`, `contacts.routes.ts`, `opportunites.routes.ts` | créés, une route par page avec son `title` |
| `opportunite-form-page` | créé, vide (pas encore d'input `id`) |
| `app.config.ts` | `withComponentInputBinding()` ajouté |
| `app.html` | un seul `<router-outlet />` |
| `layout/app-shell/` | créé : `<main>` + `<router-outlet />`, sans header pour l'instant |
| `layout/list-page-layout/`, `layout/split-layout/` | créés |

Écarts avec la cible (sections 2 et 5) :
- `app-shell` est dans `layout/app-shell/`, sans sous-dossier `smart-components/` ;
- `list-page-layout` et `split-layout` sont dans `layout/`, et non dans `shared/dump-components/`.

Pas encore créé :
- `auth.guard.ts` : les routes n'ont pas encore de `canActivate`, `/` mène à `/entreprises` sans connexion ;
- `app-header`, `main-nav`, `user-badge`, `logout-button`.

### Étape 3 (branche `branche-3`) : Bootstrap

| Élément | État |
|---|---|
| `bootstrap` | installé (`npm install bootstrap`, version 5.3) |
| `src/styles.scss` | importe les sources SCSS et personnalise les variables du thème : `@use 'bootstrap/scss/bootstrap' with (...)` |

| `layout/split-layout/` | fait : deux zones `[splitLeft]` (panneau bleu marine, 5 colonnes sur grand écran) et `[splitRight]` (dans `<main>`, contenu centré). Empilées sur mobile. Uniquement des classes Bootstrap, `.scss` vide. Les éléments projetés dans `[splitLeft]` sont répartis verticalement (haut, milieu, bas) |
| `src/index.html` | `lang="fr"`, polices Google Fonts Nunito (texte) et Poppins (titres, boutons) |

Thème défini dans `styles.scss`, d'après les écrans 00 à 06 de `.claude/support-cours.html`. Quand une couleur du design ne passe pas le contraste WCAG AA pour du texte, une teinte plus foncée est utilisée :

| Variable | Valeur | Design | Usage |
|---|---|---|---|
| `$primary` | `#c33f32` | `#de4e40` | bouton principal, avatar utilisateur, liens |
| `$dark` | `#232e59` | identique | header, titres, filtre actif |
| `$secondary` | `#556080` | identique | textes secondaires, statut Inactif |
| `$success` | `#1f8a5b` | identique | Actif, Gagné |
| `$info` | `#2563eb` | identique | Prospect |
| `$warning` | `#c98a1e` | identique | En cours |
| `$danger` | `#c33f32` | `#de4e40` | Perdu, erreurs |
| `$*-bg-subtle` / `$*-text-emphasis` | fonds clairs du design, textes foncés | textes plus clairs | pastilles de statut, avatars |
| `$body-bg` / `$body-color` | `#f4f6fa` / `#2b3350` | identique | fond et texte de page |
| `$body-tertiary-color`, `$input-placeholder-color` | `#636c8a` | `#8a92ad`, `#9aa2bd` | surtitres, libellés des KPI, placeholders |
| `$border-color` | `#e7eaf1` | identique | bordures |
| arrondis | `0.625rem`, boutons en pilule (`50rem`), champs `0.75rem` | identique | |

Les composants lisent ces valeurs via les variables CSS de Bootstrap (`var(--bs-primary)`…), sans réimporter Bootstrap.

Seul le CSS est utilisé. Le JavaScript de Bootstrap n'est pas chargé : les comportements (modale, panneau latéral…) sont faits par nos composants Angular.

### Étape 4 (branche `branche-4`) : page de connexion

| Élément | État |
|---|---|
| `auth-page` | utilise `SplitLayout`. Zone `[splitLeft]` faite, en HTML simple (pas de composant) : logo « liane. » en haut, surtitre « Mini-CRM » + `<h1>` + phrase d'accroche au milieu, « © 2026 Liane » en bas. Uniquement des classes Bootstrap. Zone `[splitRight]` encore vide (contenu de test) |

Écart avec le design (écran 00) : le surtitre « Mini-CRM » est en corail dans le design, mais le corail sur le bleu marine n'atteint pas le contraste AA (environ 2,3:1). Il est affiché en blanc à 75 %. Le corail ne reste que sur le point décoratif du logo.

Pas encore fait : la zone `[splitRight]` (onglets Connexion / Créer un compte, `auth-form`, `password-field`). Les formulaires (Signal Forms) sont reportés plus loin dans la formation.

### Étape 5 : page Entreprises

| Élément | État |
|---|---|
| `layout/list-page-layout/` | fait, d'après l'écran 02 du design. Uniquement des classes Bootstrap, `.scss` vide. Dans l'ordre : `[pageHeader]` (titre à gauche, bouton à droite, alignés en bas), `[pageKpis]` (grille `row-cols-2 row-cols-lg-4` : chaque élément projeté devient une colonne), puis une carte blanche avec `[pageToolbar]` en en-tête, le contenu par défaut (le tableau) et `[pageFooter]` en pied (compteur à gauche, pagination à droite). Pas de `<main>` : il est déjà dans `AppShell` |
