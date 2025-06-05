import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService, Doctor, Consultation } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome, {{ doctor?.name || 'Doctor' }}</h1>
        <p class="text-muted">Your medical practice dashboard</p>
      </header>
      
      <div class="row g-4">
        <!-- Profile Summary Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-person-badge me-2"></i>
                Profile Summary
              </h5>
              <div class="card-content">
                <div *ngIf="doctor" class="profile-info">
                  <p><strong>Name:</strong> {{ doctor.name }}</p>
                  <p><strong>Specialization:</strong> {{ doctor.specialization }}</p>
                  <p><strong>Email:</strong> {{ doctor.email }}</p>
                  <p><strong>Phone:</strong> {{ doctor.phone }}</p>
                </div>
                <div *ngIf="!doctor" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <a routerLink="/doctor/profile" class="btn btn-outline-primary mt-2 w-100">
                View Full Profile
              </a>
            </div>
          </div>
        </div>
        
        <!-- Patients Summary Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-people me-2"></i>
                Your Patients
              </h5>
              <div class="card-content">
                <div *ngIf="patients.length > 0" class="patients-summary">
                  <div class="patients-count">
                    <span class="count-number">{{ patients.length }}</span>
                    <span class="count-label">Active Patients</span>
                  </div>
                  <p class="mt-3">You have {{ patients.length }} patients under your care.</p>
                </div>
                <div *ngIf="patients.length === 0" class="no-patients-message">
                  <p class="text-muted">You don't have any patients assigned yet.</p>
                </div>
              </div>
              <a routerLink="/doctor/patients" class="btn btn-outline-primary mt-2 w-100">
                Manage Patients
              </a>
            </div>
          </div>
        </div>
        
        <!-- Pending Consultations Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-calendar-check me-2"></i>
                Pending Consultations
              </h5>
              <div class="card-content">
                <div *ngIf="pendingConsultations.length > 0" class="consultations-list">
                  <div *ngFor="let consultation of pendingConsultations" class="consultation-item">
                    <div class="consultation-date">
                      {{ consultation.date | date:'MMM d, y, h:mm a' }}
                    </div>
                    <div class="consultation-patient">
                      {{ consultation.patientName }}
                    </div>
                    <div class="consultation-actions">
                      <button class="btn btn-sm btn-success me-1" (click)="acceptConsultation(consultation)">
                        Accept
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="rejectConsultation(consultation)">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
                <div *ngIf="pendingConsultations.length === 0" class="no-consultations-message">
                  <p class="text-muted">No pending consultations at the moment.</p>
                </div>
              </div>
              <a routerLink="/doctor/consultations" class="btn btn-outline-primary mt-2 w-100">
                View All Consultations
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem 0;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-header h1 {
      color: #0073e6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .dashboard-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
    
    .card-title {
      color: #0073e6;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    
    .card-content {
      min-height: 180px;
    }
    
    .patients-count {
      text-align: center;
      padding: 1rem;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    .count-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      color: #0073e6;
    }
    
    .count-label {
      color: #6c757d;
      font-weight: 500;
    }
    
    .consultation-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .consultation-item:last-child {
      border-bottom: none;
    }
    
    .consultation-date {
      font-weight: 500;
    }
    
    .consultation-patient {
      color: #495057;
      margin-bottom: 0.5rem;
    }
    
    .no-consultations-message, .no-patients-message {
      display: flex;
      height: 100%;
      min-height: 100px;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  doctor: Doctor | null = null;
  patients: any[] = [];
  consultations: Consultation[] = [];
  pendingConsultations: Consultation[] = [];
  
  doctorId: number = 1; // Default for demo

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.doctorId = currentUser.id;
    }
    
    this.loadDoctorData();
    this.loadPatients();
    this.loadPendingConsultations();
  }

  loadDoctorData(): void {
    this.doctorService.getDoctor(this.doctorId).subscribe(doctor => {
      this.doctor = doctor;
    });
  }

  loadPatients(): void {
    this.doctorService.getPatients(this.doctorId).subscribe(patients => {
      this.patients = patients;
    });
  }

  loadPendingConsultations(): void {
    this.doctorService.getPendingConsultations(this.doctorId).subscribe(consultations => {
      this.pendingConsultations = consultations;
    });
  }

  acceptConsultation(consultation: Consultation): void {
    this.doctorService.acceptConsultation(this.doctorId, consultation.id).subscribe({
      next: () => {
        // Remove from pending consultations
        this.pendingConsultations = this.pendingConsultations.filter(c => c.id !== consultation.id);
      },
      error: (error) => {
        console.error('Error accepting consultation:', error);
      }
    });
  }

  rejectConsultation(consultation: Consultation): void {
    this.doctorService.rejectConsultation(this.doctorId, consultation.id).subscribe({
      next: () => {
        // Remove from pending consultations
        this.pendingConsultations = this.pendingConsultations.filter(c => c.id !== consultation.id);
      },
      error: (error) => {
        console.error('Error rejecting consultation:', error);
      }
    });
  }
}