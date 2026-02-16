import { Routes } from '@angular/router';

export const SPARE_PARTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./spare-parts-list/spare-parts-list').then(m => m.SparePartsListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./spare-part-form/spare-part-form').then(m => m.SparePartFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./spare-part-form/spare-part-form').then(m => m.SparePartFormComponent),
  },
];
