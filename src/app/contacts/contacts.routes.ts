import { Routes } from '@angular/router';

export const CONTACTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Contacts',
    loadComponent: () =>
      import('./smart-components/contacts-page/contacts-page').then((m) => m.ContactsPage),
  },
];
