import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Patient } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  template: `
    <div class="patients-container">
      <header class="page-header">
        <h1>My Patients</h1>
        <p class="text-muted">Manage your patient records</p>
      </header>
      
      <!-- Search and Filter -->
      <div class="card search-card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Search patients..." 
                       [(ngModel)]="searchTerm" (input)="applyFilter()">
                <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <!-- No Patients Message -->
      <div *ngIf="!loading && filteredPatients.length === 0" class="no-data-message">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-people no-data-icon"></i>
            <h3>No patients found</h3>
            <p class="text-muted">
              {{ searchTerm ? 'No patients match your search criteria.' : 'You don\'t have any patients assigned yet.' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Patients List -->
      <div *ngIf="!loading && filteredPatients.length > 0" class="patients-grid">
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let patient of filteredPatients">
            <div class="card patient-card h-100">
              <div class="card-body">
                <div class="patient-header">
                  <div class="patient-avatar">
                    <i class="bi bi-person-circle"></i>
                  </div>
                  <div class="patient-info">
                    <h5 class="patient-name">{{ patient.name }}</h5>
                    <div class="patient-details">
                      <span class="patient-id">ID: {{ patient.id }}</span>
                      <span class="patient-gender-age">{{ patient.gender }}, {{ calculateAge(patient.dateOfBirth) }} years</span>
                    </div>
                  </div>
                </div>
                
                <div class="patient-contact mt-3">
                  <div><i class="bi bi-envelope me-2"></i>{{ patient.email }}</div>
                  <div><i class="bi bi-telephone me-2"></i>{{ patient.phone }}</div>
                </div>
                
                <div class="patient-medical mt-3">
                  <div><strong>Blood Type:</strong> {{ patient.bloodType }}</div>
                </div>
                
                <a [routerLink]="['/doctor/patients', patient.id]" class="btn btn-primary w-100 mt-3">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patients-container {
      padding: 1rem 0;
    }
    
    .page-header {
      margin-bottom: 2rem;
    }
    
    .page-header h1 {
      color: #0073e6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .search-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .patient-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .patient-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
    
    .patient-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .patient-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }
    
    .patient-avatar i {
      font-size: 2rem;
      color: #6c757d;
    }
    
    .patient-name {
      color: #212529;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .patient-details {
      color: #6c757d;
      font-size: 0.875rem;
      display: flex;
      gap: 1rem;
    }
    
    .patient-contact, .patient-medical {
      color: #495057;
      font-size: 0.875rem;
    }
    
    .no-data-message {
      margin-top: 2rem;
    }
    
    .no-data-icon {
      font-size: 3rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }
  `]
})
export class DoctorPatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  doctorId: number = 1; // Default for demo
  searchTerm = '';

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.doctorId = currentUser.id;
    }
    
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.doctorService.getPatients(this.doctorId).subscribe({
      next: (patients) => {
        this.patients = patients;
        this.filteredPatients = patients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
      return;
    }
    
    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredPatients = this.patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.phone.toLowerCase().includes(searchTerm) ||
      patient.bloodType.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredPatients = this.patients;
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}