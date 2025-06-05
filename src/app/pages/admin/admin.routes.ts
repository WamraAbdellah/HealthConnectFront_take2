import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./patients/admin-patients.component').then(m => m.AdminPatientsComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./doctors/admin-doctors.component').then(m => m.AdminDoctorsComponent)
  }
];