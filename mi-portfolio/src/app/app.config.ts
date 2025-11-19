import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes'; // Importa tus rutas definidas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Provee la configuración de rutas a la aplicación
  ]
};