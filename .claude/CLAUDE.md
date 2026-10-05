# CLAUDE.md

Projet de la formation **Angular initiation** (Angular 22). On construit pas à pas un mini-CRM avec quatre domaines : `auth`, `entreprises`, `contacts`, `opportunites`.

Réponds en français.

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
- Tests e2e : Playwright (pas encore installé)
- Styles : SCSS
- Prettier : `printWidth: 100`, `singleQuote: true`
- Gestionnaire de paquets : npm

## Commandes

```bash
npm start       # ng serve -> http://localhost:4200
npm run build   # build de production
npm test        # tests unitaires Vitest
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

- **Découpage par métier** : un service ou un modèle vit dans le dossier de son domaine, même s'il est utilisé par d'autres features. Ne le déplace jamais dans `shared/` pour cette raison.
- **`shared/`** : uniquement du générique, qui ne connaît aucune entité métier. N'importe aucune feature.
- **Smart** (`*-page`) : seuls composants à injecter des services, ceux de leur feature, d'une autre feature ou de `shared/`. Croisent les données de plusieurs domaines si besoin, les passent aux dumb et réagissent à leurs événements.
- **Dumb** : aucun service, aucun router, aucun HTTP. Reçoit via `input()`, émet via `output()`.
- **Service** : n'injecte jamais le service d'une autre feature. Jamais fourni ni référencé dans `app.config.ts` (bundle initial) : `@Service()` suffit.
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
- Typage strict : pas de `any`. Interfaces/types des entités dans `data-access/`.
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
