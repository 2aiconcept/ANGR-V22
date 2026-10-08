import { Routes } from '@angular/router';

import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  // Page de connexion : affichée seule, sans le shell (pas d'en-tête ni de navigation)
  {
    path: 'connexion',
    title: 'Connexion',
    loadComponent: () =>
      import('./auth/smart-components/auth-page/auth-page').then((m) => m.AuthPage),
  },

  // Pages connectées : affichées à l'intérieur du shell, dans son <router-outlet />
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: 'entreprises',
        loadChildren: () =>
          import('./entreprises/entreprises.routes').then((m) => m.ENTREPRISES_ROUTES),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.routes').then((m) => m.CONTACTS_ROUTES),
      },
      {
        path: 'opportunites',
        loadChildren: () =>
          import('./opportunites/opportunites.routes').then((m) => m.OPPORTUNITES_ROUTES),
      },
      { path: '', redirectTo: 'entreprises', pathMatch: 'full' },
    ],
  },

  // Adresse inconnue : retour à l'accueil
  { path: '**', redirectTo: '/connexion' },
];
