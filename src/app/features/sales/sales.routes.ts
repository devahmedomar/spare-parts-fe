import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./sales-list/sales-list').then(m => m.SalesListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./sale-form/sale-form').then(m => m.SaleFormComponent),
  },
];
