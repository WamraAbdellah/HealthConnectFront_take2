import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService, Doctor } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-doctors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doctors-container">
      <header class="page-header">
        <h1>Find a Doctor</h1>
        <p class="text-muted">Browse and select your preferred doctor</p>
      </header>
      
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card assigned-doctor-card h-100">
            <div class="card-body">
              <h5 class="card-title">Your Assigned Doctor</h5>
              <div *ngIf="loadingAssigned" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <div *ngIf="!loadingAssigned && assignedDoctor" class="assigned-doctor-details">
                <div class="doctor-name">{{ assignedDoctor.name }}</div>
                <div class="doctor-specialization">{{ assignedDoctor.specialization }}</div>
                <div class="doctor-contact">
                  <div><i class="bi bi-envelope me-2"></i>{{ assignedDoctor.email }}</div>
                  <div><i class="bi bi-telephone me-2"></i>{{ assignedDoctor.phone }}</div>
                </div>
              </div>
              
              <div *ngIf="!loadingAssigned && !assignedDoctor" class="no-doctor-message">
                <p class="text-muted">You don't have an assigned doctor yet. Select one from the list below.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 class="section-title">Available Doctors</h3>
      
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div *ngIf="!loading && doctors.length === 0" class="no-data-message">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-person-x no-data-icon"></i>
            <h3>No doctors available</h3>
            <p class="text-muted">
              There are currently no doctors available in the system.
            </p>
          </div>
        </div>
      </div>
      
      <div class="row g-4" *ngIf="!loading && doctors.length > 0">
        <div class="col-md-6 col-lg-4" *ngFor="let doctor of doctors">
          <div class="card doctor-card h-100">
            <div class="card-body">
              <div class="doctor-header">
                <div class="doctor-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="doctor-info">
                  <h5 class="doctor-name">{{ doctor.name }}</h5>
                  <div class="doctor-specialization">{{ doctor.specialization }}</div>
                </div>
              </div>
              
              <div class="doctor-contact mt-3">
                <div><i class="bi bi-envelope me-2"></i>{{ doctor.email }}</div>
                <div><i class="bi bi-telephone me-2"></i>{{ doctor.phone }}</div>
              </div>
              
              <button class="btn btn-primary w-100 mt-4" 
                      [disabled]="assigningDoctor === doctor.id"
                      (click)="assignDoctor(doctor.id)">
                <span *ngIf="assigningDoctor === doctor.id" class="spinner-border spinner-border-sm me-1"></span>
                {{ isCurrentDoctor(doctor.id) ? 'Current Doctor' : 'Select as My Doctor' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success Message -->
      <div *ngIf="assignSuccess" class="alert alert-success alert-dismissible fade show mt-4">
        Doctor assigned successfully!
        <button type="button" class="btn-close" (click)="assignSuccess = false"></button>
      </div>
      
      <!-- Error Message -->
      <div *ngIf="assignError" class="alert alert-danger alert-dismissible fade show mt-4">
        {{ assignError }}
        <button type="button" class="btn-close" (click)="assignError = ''"></button>
      </div>
    </div>
  `,
  styles: [`
    .doctors-container {
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
    
    .section-title {
      color: #0073e6;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .assigned-doctor-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      background-color: #f8f9fa;
      border-left: 4px solid #0073e6;
    }
    
    .assigned-doctor-card .card-title {
      color: #0073e6;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    
    .doctor-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .doctor-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
    
    .doctor-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .doctor-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }
    
    .doctor-avatar i {
      font-size: 2rem;
      color: #6c757d;
    }
    
    .doctor-name {
      color: #212529;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .doctor-specialization {
      color: #0073e6;
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .doctor-contact {
      color: #6c757d;
      font-size: 0.875rem;
    }
    
    .no-doctor-message, .no-data-message {
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-data-icon {
      font-size: 3rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }
  `]
})
export class PatientDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  assignedDoctor: Doctor | null = null;
  loading = false;
  loadingAssigned = false;
  assigningDoctor: number | null = null;
  assignSuccess = false;
  assignError = '';
  userId: number = 1; // Default for demo

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
    }
    
    this.loadAssignedDoctor();
    this.loadDoctors();
  }

  loadAssignedDoctor(): void {
    this.loadingAssigned = true;
    this.patientService.getAssignedDoctor(this.userId).subscribe({
      next: (doctor) => {
        this.assignedDoctor = doctor;
        this.loadingAssigned = false;
      },
      error: (error) => {
        console.error('Error loading assigned doctor:', error);
        this.loadingAssigned = false;
      }
    });
  }

  loadDoctors(): void {
    this.loading = true;
    this.patientService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
      }
    });
  }

  assignDoctor(doctorId: number): void {
    if (this.isCurrentDoctor(doctorId)) {
      return; // Already assigned
    }
    
    this.assigningDoctor = doctorId;
    this.assignSuccess = false;
    this.assignError = '';
    
    this.patientService.assignDoctor(this.userId, doctorId).subscribe({
      next: () => {
        // Update the assigned doctor
        const newDoctor = this.doctors.find(d => d.id === doctorId) || null;
        this.assignedDoctor = newDoctor;
        this.assignSuccess = true;
        this.assigningDoctor = null;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.assignSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error assigning doctor:', error);
        this.assignError = 'Failed to assign doctor. Please try again.';
        this.assigningDoctor = null;
      }
    });
  }

  isCurrentDoctor(doctorId: number): boolean {
    return this.assignedDoctor !== null && this.assignedDoctor.id === doctorId;
  }
}