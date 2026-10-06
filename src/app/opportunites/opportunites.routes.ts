import { Routes } from '@angular/router';

export const OPPORTUNITES_ROUTES: Routes = [
  {
    path: '',
    title: 'Opportunités',
    loadComponent: () =>
      import('./smart-components/opportunites-page/opportunites-page').then(
        (m) => m.OpportunitesPage,
      ),
  },
  {
    path: 'nouvelle',
    title: 'Nouvelle opportunité',
    loadComponent: () =>
      import('./smart-components/opportunite-form-page/opportunite-form-page').then(
        (m) => m.OpportuniteFormPage,
      ),
  },
  {
    path: ':id/modifier',
    title: 'Modifier une opportunité',
    loadComponent: () =>
      import('./smart-components/opportunite-form-page/opportunite-form-page').then(
        (m) => m.OpportuniteFormPage,
      ),
  },
];
