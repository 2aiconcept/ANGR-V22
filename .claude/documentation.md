# Architecture du frontend Angular — Mini-CRM

Ce document décrit l'architecture retenue pour le frontend Angular 21 du Mini-CRM : l'organisation des dossiers, le routage, et le rôle de chaque composant et de chaque service. Il sert de référence à l'agent codeur comme aux développeurs.

---

## 1. Principes

- **Organisation par feature.** Chaque domaine métier (`auth`, `entreprises`, `contacts`, `opportunites`) a son propre dossier. Le code transverse est dans `layout/` et `shared/`.
- **Trois dossiers par feature :**
  - `data-access/` : le service qui appelle l'API et porte l'état de la feature ;
  - `smart-components/` : les pages routées, qui lisent l'état et orchestrent ;
  - `dumb-components/` : les composants d'affichage, qui ne reçoivent que des `input()` et n'émettent que des `output()`. Aucun accès au service, aucun appel HTTP.
- **Un smart component par page.** Il est le seul à injecter le service de sa feature. Il passe les données aux dumb components et réagit à leurs événements.
- **Standalone, Signals, OnPush, zoneless.** Aucun `NgModule`. Contrôle de flux en `@if` / `@for` / `@switch`. Injection par `inject()`.
- **Pas de composant sans comportement.** Un titre de page, un texte ou un simple conteneur se font en HTML avec des classes globales. Un composant n'est créé que s'il porte un comportement, ou un bloc réutilisé à plusieurs endroits.
- **Réutilisation par contrat, pas par type.** Un composant de `shared/` ne connaît aucune entité métier : il ne sait pas ce qu'est une entreprise. Chaque page lui fournit ses données et, si besoin, ses templates.

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
│  │  └─ auth.service.ts
│  ├─ smart-components/
│  │  └─ auth-page/
│  ├─ dumb-components/
│  │  └─ auth-form/
│  └─ auth.guard.ts             ← authGuard et guestGuard
│
├─ entreprises/
│  ├─ data-access/
│  │  └─ entreprises.service.ts
│  ├─ smart-components/
│  │  └─ entreprises-page/
│  └─ dumb-components/
│     └─ entreprise-form/
│
├─ contacts/
│  ├─ data-access/
│  │  └─ contacts.service.ts
│  ├─ smart-components/
│  │  └─ contacts-page/
│  └─ dumb-components/
│     └─ contact-form/
│
├─ opportunites/
│  ├─ data-access/
│  │  └─ opportunites.service.ts
│  ├─ smart-components/
│  │  ├─ opportunites-page/
│  │  └─ opportunite-form-page/
│  ├─ dumb-components/
│  │  └─ opportunite-form/
│  └─ opportunites.routes.ts
│
├─ layout/
│  ├─ smart-components/
│  │  └─ app-shell/
│  └─ dumb-components/
│     ├─ app-header/
│     ├─ main-nav/
│     ├─ user-badge/
│     └─ logout-button/
│
└─ shared/
   └─ dumb-components/
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
  { path: 'connexion', canActivate: [guestGuard],
    loadComponent: () => import('./auth/smart-components/auth-page/auth-page').then(m => m.AuthPage) },

  { path: '', component: AppShell, canActivate: [authGuard], children: [
      { path: 'entreprises',
        loadComponent: () => import('./entreprises/smart-components/entreprises-page/entreprises-page').then(m => m.EntreprisesPage) },
      { path: 'contacts',
        loadComponent: () => import('./contacts/smart-components/contacts-page/contacts-page').then(m => m.ContactsPage) },
      { path: 'opportunites',
        loadChildren: () => import('./opportunites/opportunites.routes').then(m => m.OPPORTUNITES_ROUTES) },
      { path: '', redirectTo: 'entreprises', pathMatch: 'full' },
  ]},

  { path: '**', redirectTo: '' },
];
```

```ts
// opportunites/opportunites.routes.ts
export const OPPORTUNITES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./smart-components/opportunites-page/opportunites-page').then(m => m.OpportunitesPage) },
  { path: 'nouvelle', loadComponent: () => import('./smart-components/opportunite-form-page/opportunite-form-page').then(m => m.OpportuniteFormPage) },
  { path: ':id/modifier', loadComponent: () => import('./smart-components/opportunite-form-page/opportunite-form-page').then(m => m.OpportuniteFormPage) },
];
```

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

- `loadComponent` pour les features d'une seule page (`auth`, `entreprises`, `contacts`), `loadChildren` pour une feature qui a ses propres routes (`opportunites`).
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
| `auth.service.ts` | data-access | Connexion, inscription, déconnexion. Garde l'utilisateur courant et le jeton JWT. Expose `user()` et `isLogged()` en signals, utilisés par les guards et par `AppShell`. |
| `auth-page` | smart | Page `/connexion`. Utilise `SplitLayout` : texte de présentation à gauche, formulaire à droite. Gère l'onglet actif (connexion ou inscription), appelle le service et redirige vers `/entreprises` après succès. |
| `auth-form` | dumb | Un seul formulaire pour les deux cas, selon un input `mode` (`'signin'` ou `'signup'`). En inscription, il affiche en plus le nom et la confirmation du mot de passe, et active les règles de robustesse du mot de passe. Émet les valeurs saisies. |
| `auth.guard.ts` | — | `authGuard` et `guestGuard`, voir 3.3. |

### 4.2 `entreprises/`

| Élément | Type | Rôle |
|---|---|---|
| `entreprises.service.ts` | data-access | Liste, création et modification des entreprises (`GET`, `POST`, `PUT`). Porte la liste en état et les valeurs calculées pour les statistiques. |
| `entreprises-page` | smart | Page `/entreprises`. Utilise `ListPageLayout`. Gère la recherche, le filtre de statut, la page courante, et l'ouverture du `SidePanel` d'ajout ou de modification. |
| `entreprise-form` | dumb | Formulaire d'une entreprise : nom, secteur, adresse, téléphone, statut (`Actif` / `Inactif` via `SegmentedControl`). Reçoit la valeur initiale, émet la valeur saisie. |

Le formulaire s'affiche dans un **panneau latéral** (`SidePanel`), sans changement de route : la page contient le panneau dans un `@if`, piloté par un signal `editing` (`null`, `'new'` ou l'entreprise à modifier).

### 4.3 `contacts/`

| Élément | Type | Rôle |
|---|---|---|
| `contacts.service.ts` | data-access | Liste, création et modification des contacts. |
| `contacts-page` | smart | Page `/contacts`. Même structure que la page Entreprises, mais le formulaire s'ouvre dans une **popup** (`Modal`). |
| `contact-form` | dumb | Formulaire d'un contact : prénom, nom, e-mail, téléphone, entreprise de rattachement. |

### 4.4 `opportunites/`

| Élément | Type | Rôle |
|---|---|---|
| `opportunites.service.ts` | data-access | Liste, création et modification des opportunités. Calcule le pipeline ouvert et le montant gagné. |
| `opportunites-page` | smart | Page `/opportunites`. Liste avec statistiques, recherche et filtre par statut. |
| `opportunite-form-page` | smart | Pages `/opportunites/nouvelle` et `/opportunites/:id/modifier`. Reçoit `id` en input, distingue création et modification, gère le cas d'une opportunité introuvable, enregistre puis revient à la liste. |
| `opportunite-form` | dumb | Formulaire d'une opportunité : intitulé, entreprise, contact (filtré selon l'entreprise choisie), montant, date de clôture, statut, notes. Ne sait pas s'il crée ou s'il modifie. |

Ici, le formulaire est sur **une page dédiée** : c'est la seule feature qui a ses propres routes.

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
    <button appButton variant="primary" (click)="editing.set('new')">Nouvelle entreprise</button>
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
- **Les boutons d'action** : un élément `<button>` natif, mis en forme par une directive ou des classes (`primary`, `secondary`, `ghost`).

---

## 7. Point ouvert : service ou store

Le schéma place un **service** dans chaque dossier `data-access/`. Or les règles actuelles du projet (`CLAUDE.md`, `frontend-CLAUDE.md`) imposent un **NgRx Signal Store par feature, sans service classique : le store porte l'état et le HTTP**.

Les deux options :
- **Garder la règle** : `data-access/` contient `entreprises.store.ts` au lieu de `entreprises.service.ts`, et les smart components injectent le store.
- **Séparer** : le service fait les appels HTTP, le store porte l'état et appelle le service. Il faut alors mettre à jour les fichiers de règles que lit l'agent.

Cette décision doit être tranchée avant la génération du code.

---

## 8. Le dossier `.claude/`

En plus des fichiers de règles, le dossier `.claude/` à la racine du dépôt contient les documents de référence que l'agent consulte avant de coder :

```
.claude/
├─ CLAUDE.md                       ← règles de codage du dépôt
├─ architecture/
│  └─ architecture-frontend.md     ← ce document
├─ design/
│  ├─ connexion.html               ← maquette de la page de connexion
│  ├─ entreprises.html             ← liste et panneau latéral
│  ├─ contacts.html                ← liste et popup
│  ├─ opportunites.html            ← liste
│  ├─ opportunite-form.html        ← page de formulaire
│  └─ reperer-les-components.pdf   ← découpage en composants, slide par slide
└─ support-de-cours/
   └─ …                            ← guides et supports de la formation
```

- **`design/`** : les maquettes HTML, source de vérité pour le rendu attendu (couleurs, espacements, états, comportement mobile).
- **`architecture/`** : ce document, source de vérité pour le découpage et le nommage.
- **`support-de-cours/`** : les guides de la formation, pour que l'agent applique les mêmes conventions que celles enseignées.

L'agent lit ces trois sources avant de proposer un plan de tâches. En cas de contradiction entre une maquette et ce document, c'est ce document qui l'emporte pour la structure, et la maquette pour le rendu.

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
