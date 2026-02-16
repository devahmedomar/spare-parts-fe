import { Routes } from '@angular/router';

export const CERTIFICATES_ROUTES: Routes = [
  { path: '', redirectTo: 'motor', pathMatch: 'full' },
  {
    path: 'motor',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./motor-certificates/motor-cert-list/motor-cert-list').then(
            (m) => m.MotorCertListComponent,
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./motor-certificates/motor-cert-form/motor-cert-form').then(
            (m) => m.MotorCertFormComponent,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./motor-certificates/motor-cert-form/motor-cert-form').then(
            (m) => m.MotorCertFormComponent,
          ),
      },
    ],
  },
  // {
  //   path: 'power-of-attorney',
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () =>
  //         import('./power-of-attorney/poa-list/poa-list').then((m) => m.PoaListComponent),
  //     },
  //     {
  //       path: 'new',
  //       loadComponent: () =>
  //         import('./power-of-attorney/poa-form/poa-form').then((m) => m.PoaFormComponent),
  //     },
  //     {
  //       path: ':id/edit',
  //       loadComponent: () =>
  //         import('./power-of-attorney/poa-form/poa-form').then((m) => m.PoaFormComponent),
  //     },
  //   ],
  // },
  // {
  //   path: 'contracts',
  //   children: [
  //     {
  //       path: '',
  //       loadComponent: () =>
  //         import('./registered-contracts/contract-list/contract-list').then(m => m.ContractListComponent),
  //     },
  //     {
  //       path: 'new',
  //       loadComponent: () =>
  //         import('./registered-contracts/contract-form/contract-form').then(m => m.ContractFormComponent),
  //     },
  //     {
  //       path: ':id/edit',
  //       loadComponent: () =>
  //         import('./registered-contracts/contract-form/contract-form').then(m => m.ContractFormComponent),
  //     },
  //   ],
  // },
];
