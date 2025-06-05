import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/patient-profile.component').then(m => m.PatientProfileComponent)
  },
  {
    path: 'consultations',
    loadComponent: () => import('./consultations/patient-consultations.component').then(m => m.PatientConsultationsComponent)
  },
  {
    path: 'consultations/book',
    loadComponent: () => import('./consultations/book-consultation/book-consultation.component').then(m => m.BookConsultationComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./doctors/patient-doctors.component').then(m => m.PatientDoctorsComponent)
  }
];