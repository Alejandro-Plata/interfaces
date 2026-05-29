import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

Chart.register(...registerables);
Chart.defaults.color = '#e5e5e5';
Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
