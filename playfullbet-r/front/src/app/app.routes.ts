import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/panel/panel.component').then((m) => m.PanelComponent),
  },
  {
    path: 'dashboard/classification',
    loadComponent: () => import('./pages/dashboard/classification/classification.component').then((m) => m.ClassificationComponent),
  },
  {
    path: 'dashboard/ranking',
    loadComponent: () => import('./pages/dashboard/ranking/ranking.component').then((m) => m.RankingComponent),
  },
  {
    path: 'dashboard/profile',
    loadComponent: () => import('./pages/dashboard/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'match/:id',
    loadComponent: () => import('./pages/dashboard/match-detail/match-detail.component').then((m) => m.MatchDetailComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
