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
    path: 'missions',
    loadComponent: () => import('./pages/missions-list/missions-list.component').then((m) => m.MissionsListComponent),
  },
  {
    path: 'mission-detail',
    loadComponent: () => import('./pages/mission-detail/mission-detail.component').then((m) => m.MissionDetailComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/auth/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
