import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./patients/doctor-patients.component').then(m => m.DoctorPatientsComponent)
  },
  {
    path: 'patients/:id',
    loadComponent: () => import('./patients/patient-details/patient-details.component').then(m => m.PatientDetailsComponent)
  },
  {
    path: 'consultations',
    loadComponent: () => import('./consultations/doctor-consultations.component').then(m => m.DoctorConsultationsComponent)
  }
];