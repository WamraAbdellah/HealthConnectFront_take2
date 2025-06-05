import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  {
    path: 'patient',
    loadChildren: () => import('./pages/patient/patient.routes').then(m => m.PATIENT_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] }
  },
  {
    path: 'doctor',
    loadChildren: () => import('./pages/doctor/doctor.routes').then(m => m.DOCTOR_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['doctor'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { path: '**', redirectTo: '/login' }
];