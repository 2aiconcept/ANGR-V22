# CLAUDE.md

Projet de la formation **Angular initiation** (Angular 22). On construit pas à pas un mini-CRM avec quatre domaines : `auth`, `entreprises`, `contacts`, `opportunites`.

Réponds en français.

## Ton rôle

Tu es expert Angular, architecte frontend et expert en tests unitaires (Vitest) et e2e (Playwright). Tu appliques ces expertises en respectant le niveau de la formation : un code simple, lisible par un débutant.

## Documents de référence

Ces deux fichiers sont importés ci-dessous et chargés à chaque conversation :

- **`.claude/documentation.md`** : l'architecture et tous les composants créés jusqu'ici, à quoi ils servent et comment ils sont utilisés dans l'appli. Sa section « État d'avancement » dit ce qui existe déjà dans le code.
- **`.claude/endpoints-et-donnees.md`** : les endpoints de l'API (`https://mini-crm-api-production-298d.up.railway.app`), les données à envoyer et les réponses. Les interfaces d'entités et les services doivent le respecter.

Au fil de la formation, on ajoute des slides au support de cours et on complète la documentation. Quand tu crées ou modifies un composant, un service, une route ou un guard, mets à jour `documentation.md` (y compris « État d'avancement ») dans la même tâche. Si l'API évolue, mets à jour `endpoints-et-donnees.md`.

@documentation.md

@endpoints-et-donnees.md

## Périmètre de la formation

- **Initiation** : le public découvre Angular. Le code doit être le plus simple possible à écrire et à lire pour un débutant.
- **Services uniquement** pour l'état et les appels HTTP (dans `data-access/`). Pas de NgRx, pas de Signal Store, pas de Nx : ces sujets viennent plus tard, dans la formation Angular avancé, où l'application sera transformée.
- **Nouveautés Angular 22** : utilise les API actuelles plutôt que les anciennes (voir ci-dessous). Si une API est encore expérimentale, signale-le.

## Stack

- Angular 22 : standalone, signals, zoneless, OnPush par défaut
- TypeScript 6
- Tests unitaires : Vitest + jsdom (`ng test`), pas Karma/Jasmine
- Tests e2e : Playwright, dans `e2e/`
- Styles : SCSS + Bootstrap 5.3 (CSS uniquement, pas le JavaScript de Bootstrap)
- Prettier : `printWidth: 100`, `singleQuote: true`
- Gestionnaire de paquets : npm

## Commandes

```bash
npm start       # ng serve -> http://localhost:4200
npm run build   # build de production
npm test        # tests unitaires Vitest

npm run e2e           # tests e2e Playwright (dossier e2e/), sans navigateur visible
npm run e2e:ui        # mode UI : pas à pas, relance automatique
npm run e2e:headed    # affiche le navigateur pendant les tests
npm run e2e:chromium  # Chromium uniquement, plus rapide
npm run e2e:report    # ouvre le rapport HTML du dernier lancement
npm run e2e:codegen   # enregistre les clics sur http://localhost:4200 et génère le test
```

## Architecture

Une feature = un dossier dans `src/app/` :

```
src/app/<feature>/
  data-access/        # le service de la feature (HTTP + état en signals) + spec
  smart-components/   # pages routées : injectent le service, orchestrent
  dump-components/    # composants de présentation (dumb) : input()/output() uniquement
```

Le dossier s'appelle `dump-components` (et non `dumb-`) dans le code : garde-le tel quel.

- **Où ranger un élément** (modèle, service, composant) : utilisé par **une seule** feature, il reste dans le dossier de cette feature ; utilisé par **plus d'une** feature, il va dans `shared/` (ex. : `shared/utils/models/entreprise.ts`). On le déplace dans `shared/` dès qu'une deuxième feature en a besoin.
- **Aucune dépendance entre features** : une feature n'importe jamais rien d'une autre feature, seulement de `shared/` et `layout/`. Comme pour les modules autrefois, et pour respecter plus tard les contraintes de dépendances de Nx (une librairie par feature, sans interdépendance).
- **`shared/`** : n'importe jamais une feature.
- **Smart** (`*-page`) : seuls composants à injecter des services, ceux de leur feature ou de `shared/`. Croisent les données si besoin, les passent aux dumb et réagissent à leurs événements.
- **Dumb** : aucun service, aucun router, aucun HTTP. Reçoit via `input()`, émet via `output()`.
- **Service** : n'injecte jamais le service d'une autre feature (s'il en a besoin, ce service partagé va dans `shared/`). Jamais fourni ni référencé dans `app.config.ts` (bundle initial) : `@Service()` suffit.
- On n'importe jamais un composant (smart ou dumb) d'une autre feature. Règles complètes : `documentation.md`, section 1.1.
- Pas de composant sans comportement : un titre ou un conteneur simple reste du HTML.

## Angular 22 : API à utiliser

| À utiliser | Plutôt que |
|---|---|
| `@Service()` | `@Injectable({ providedIn: 'root' })` |
| `inject()` | injection par le constructeur |
| `input()`, `output()`, `model()` | `@Input()`, `@Output()` |
| `signal()`, `computed()`, `linkedSignal()` | propriétés mutables, `BehaviorSubject` |
| `@if`, `@for` (avec `track`), `@switch`, `@let` | `*ngIf`, `*ngFor`, `*ngSwitch` |
| `httpResource()` / `resource()` pour lire des données | `subscribe` manuel dans le composant |
| Signal Forms (`@angular/forms/signals`) | formulaires réactifs classiques |
| `host: {}` dans `@Component` | `@HostBinding`, `@HostListener` |
| `[class.x]`, `[style.x]` | `ngClass`, `ngStyle` |
| OnPush (défaut), zoneless | `zone.js`, `ChangeDetectionStrategy.Default` |

Pas de `NgModule`.

## Styles et Bootstrap

- Bootstrap est importé **une seule fois**, dans `src/styles.scss`, avec `@use 'bootstrap/scss/bootstrap' with (...)`.
- Les variables Sass de Bootstrap utilisées par l'appli (couleurs `$primary`, `$secondary`, `$success`…, fond, police, arrondis) sont **toutes déclarées dans ce `with (...)`**. Besoin d'une nouvelle valeur de thème : on l'ajoute là, jamais ailleurs.
- Dans un composant, on ne réimporte pas Bootstrap (tout son CSS serait copié dans le composant). On utilise les variables CSS qu'il génère : `var(--bs-primary)`, `var(--bs-danger)`, `var(--bs-border-radius)`, `var(--bs-body-bg)`…
- Pas de couleur en dur dans un composant : toujours une variable `--bs-*`.
- **Le moins de SCSS custom possible, dans toute l'appli.** On met en forme avec les classes Bootstrap dans le template : composants (`btn btn-primary`, `form-control`, `form-label`, `table`, `badge`, `card`, `alert`), mise en page (`container`, `row`, `col-*`, `d-flex`, `gap-*`, `justify-content-*`), espacements (`p-*`, `m-*`), texte et couleurs (`fw-bold`, `text-secondary`, `bg-primary`), bordures (`border`, `rounded`). Avant d'écrire une règle SCSS, vérifier qu'aucune classe Bootstrap ne le fait déjà.
- Le `.scss` d'un composant reste vide par défaut. On n'y écrit que ce que Bootstrap ne sait pas faire (ex. : un positionnement propre au composant), avec les variables `--bs-*`.
- **Design de référence** : les premiers écrans (00 à 06 : Connexion, AppHeader, ListPageLayout, Panneau entreprise, Contacts, Popup contact) de `.claude/support-cours.html`. Les couleurs de `styles.scss` en viennent ; quelques-unes sont légèrement foncées pour respecter le contraste AA (commentaire « AA » dans le fichier).
- Couleurs : `primary` = corail (action principale), `dark` = bleu marine (header, titres, filtre actif), `secondary` = gris.
- Statuts : `success` = Gagné / Actif, `secondary` = Inactif, `info` = Prospect, `warning` = En cours, `danger` = Perdu. Une pastille de statut ou un avatar s'écrit `bg-*-subtle text-*-emphasis` (ex. : `badge rounded-pill bg-success-subtle text-success-emphasis`), qui respecte le contraste.
- Polices : Nunito pour le texte, Poppins pour les titres et les boutons (chargées dans `index.html`).

## Code simple pour débutants

- Le code le plus direct qui marche. Pas d'abstraction, de généricité ou de pattern « au cas où ».
- Une idée par fonction, des fonctions courtes.
- Évite RxJS quand un signal suffit. Si RxJS est nécessaire, reste sur les opérateurs de base (`map`, `switchMap`, `catchError`).
- Pas d'astuce TypeScript avancée (types conditionnels, génériques complexes).
- Ajoute un commentaire seulement si le « pourquoi » n'est pas évident, jamais pour paraphraser le code.

## Clean code

- Noms explicites et en français pour le métier (`entreprises`, `enregistrer()`), sans abréviations.
- Booléens nommés comme des questions : `isLogged`, `hasError`.
- Une responsabilité par fichier, par composant, par fonction.
- Pas de code mort, pas de `console.log` laissé, pas de valeurs magiques (constantes nommées).
- Typage strict : pas de `any`. Interfaces/types des entités dans `<feature>/utils/models/`, ou dans `shared/utils/models/` si plusieurs features les utilisent.
- `readonly` sur les propriétés qui ne sont pas réassignées, `protected` pour ce qui n'est utilisé que par le template.
- Retours anticipés plutôt que des `if` imbriqués.

## Accessibilité (obligatoire, sans qu'on le demande)

- HTML sémantique : `<button>` pour une action, `<a routerLink>` pour une navigation, `<main>`, `<nav>`, `<header>`, titres `h1` → `h2` sans sauter de niveau.
- Chaque champ a un `<label for>` associé. Erreurs reliées par `aria-describedby`, champ invalide signalé par `aria-invalid`.
- Tout est utilisable au clavier, avec un focus visible (ne jamais supprimer `outline` sans le remplacer).
- Modales et panneaux : focus déplacé à l'ouverture, piégé dedans, rendu à l'élément d'origine à la fermeture, fermeture par Échap, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Bouton icône seul : `aria-label`. Image décorative : `alt=""`, image informative : `alt` descriptif.
- Messages dynamiques (succès, erreur, chargement) annoncés via `aria-live="polite"` (ou `role="alert"` pour une erreur).
- Contraste WCAG AA (4,5:1 pour le texte). L'information ne passe jamais par la couleur seule.
- ARIA uniquement quand le HTML natif ne suffit pas.

## Tests unitaires (Vitest)

- Un fichier `.spec.ts` à côté de chaque composant et service.
- Teste le comportement visible, pas l'implémentation : ce qui s'affiche, ce qui est émis, ce qui est appelé.
- Structure Arrange / Act / Assert, un comportement par test, noms de tests en français qui décrivent le comportement (`it('affiche une erreur si l'e-mail est vide')`).
- **Dumb** : fixe les inputs avec `fixture.componentRef.setInput()`, vérifie le rendu et les `output()` émis.
- **Smart** : remplace le service par un faux via `providers: [{ provide: XService, useValue: ... }]`.
- **Service** : `provideHttpClient()` + `provideHttpClientTesting()`, vérifie les requêtes avec `HttpTestingController` et termine par `httpTesting.verify()`.
- Sélectionne les éléments par rôle, libellé ou texte, pas par classe CSS.
- `await fixture.whenStable()` après une action (zoneless).
- Tests indépendants : pas d'état partagé entre deux tests.

## Tests e2e (Playwright)

- Teste les parcours utilisateur complets (connexion, créer une entreprise, modifier une opportunité…), pas les détails déjà couverts en unitaire.
- Localisateurs accessibles en priorité : `getByRole`, `getByLabel`, `getByText`. `getByTestId` en dernier recours. Jamais de sélecteur CSS ou XPath fragile.
- Assertions web-first qui attendent automatiquement : `await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`. Jamais de `waitForTimeout`.
- Chaque test est indépendant : il prépare ses propres données et ne dépend pas de l'ordre d'exécution.
- Connexion factorisée : `storageState` via un projet `setup`, ou une fixture, plutôt que se reconnecter dans chaque test.
- `page.route()` pour simuler l'API quand on teste le frontend seul.
- Regroupe avec `test.describe`, prépare avec `test.beforeEach`, noms de tests en français.
- Page Object seulement si un écran est réutilisé dans plusieurs fichiers de test (rester simple).
- Vérifie l'accessibilité des pages principales avec `@axe-core/playwright`.

## Conventions

- Nommage Angular v20+ : pas de suffixe `Component` / `.component` (`AuthPage` dans `auth-page.ts`).
- Fichiers séparés `.ts` / `.html` / `.scss` / `.spec.ts` par composant.
- Préfixe des sélecteurs : `app-`.
- Routes dans `src/app/app.routes.ts`, pages chargées en lazy loading (`loadComponent` / `loadChildren`).
