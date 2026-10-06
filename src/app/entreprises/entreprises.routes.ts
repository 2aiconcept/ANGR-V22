import { Routes } from '@angular/router';

export const ENTREPRISES_ROUTES: Routes = [
  {
    path: '',
    title: 'Entreprises',
    loadComponent: () =>
      import('./smart-components/entreprises-page/entreprises-page').then(
        (m) => m.EntreprisesPage,
      ),
  },
];
