import { Routes } from '@angular/router';

export const RETURNS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./returns-list/returns-list').then(m => m.ReturnsListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./return-form/return-form').then(m => m.ReturnFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./return-form/return-form').then(m => m.ReturnFormComponent),
  },
];
