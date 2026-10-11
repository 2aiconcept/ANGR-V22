import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding : le paramètre :id d'une route arrive comme un input() de la page
    provideRouter(routes, withComponentInputBinding()),
    // Rend HttpClient et httpResource() disponibles dans toute l'appli
    provideHttpClient(),
  ],
};
