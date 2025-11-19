import { Routes } from '@angular/router';
import { Home } from './pages/home/home/home';
import { Projects } from './pages/projects/projects/projects';
import { Contact } from './pages/contact/contact/contact';
import { About } from './pages/about/about/about';


export const routes: Routes = [
  { path: '', component: Home }, // Ruta por defecto
  { path: 'about', component: About },
  { path: 'projects', component: Projects },
  { path: 'contact', component: Contact },
  { path: '**', component: Home } // Ruta comodín para URLs no encontradas
];