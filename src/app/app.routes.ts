import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'spare-parts',
        loadChildren: () =>
          import('./features/spare-parts/spare-parts.routes').then(m => m.SPARE_PARTS_ROUTES),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./features/sales/sales.routes').then(m => m.SALES_ROUTES),
      },
      {
        path: 'shortages',
        loadComponent: () =>
          import('./features/spare-parts/shortages/shortages').then(m => m.ShortagesComponent),
      },
      {
        path: 'returns',
        loadChildren: () =>
          import('./features/returns/returns.routes').then(m => m.RETURNS_ROUTES),
      },
      {
        path: 'certificates',
        loadChildren: () =>
          import('./features/certificates/certificates.routes').then(m => m.CERTIFICATES_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
