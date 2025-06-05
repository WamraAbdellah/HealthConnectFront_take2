import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService, Patient, Consultation, Doctor } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome, {{ patient?.name || 'Patient' }}</h1>
        <p class="text-muted">Your personal health dashboard</p>
      </header>
      
      <div class="row g-4">
        <!-- Profile Summary Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-person-circle me-2"></i>
                Profile Summary
              </h5>
              <div class="card-content">
                <div *ngIf="patient" class="profile-info">
                  <p><strong>Name:</strong> {{ patient.name }}</p>
                  <p><strong>Email:</strong> {{ patient.email }}</p>
                  <p><strong>Date of Birth:</strong> {{ patient.dateOfBirth | date }}</p>
                  <p><strong>Blood Type:</strong> {{ patient.bloodType }}</p>
                </div>
                <div *ngIf="!patient" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <a routerLink="/patient/profile" class="btn btn-outline-primary mt-2 w-100">
                View Full Profile
              </a>
            </div>
          </div>
        </div>
        
        <!-- Assigned Doctor Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-heart-pulse me-2"></i>
                Your Doctor
              </h5>
              <div class="card-content">
                <div *ngIf="assignedDoctor" class="doctor-info">
                  <p><strong>Name:</strong> {{ assignedDoctor.name }}</p>
                  <p><strong>Specialization:</strong> {{ assignedDoctor.specialization }}</p>
                  <p><strong>Email:</strong> {{ assignedDoctor.email }}</p>
                  <p><strong>Phone:</strong> {{ assignedDoctor.phone }}</p>
                </div>
                <div *ngIf="!assignedDoctor" class="no-doctor-message">
                  <p class="text-muted">You don't have an assigned doctor yet.</p>
                </div>
              </div>
              <a routerLink="/patient/doctors" class="btn btn-outline-primary mt-2 w-100">
                {{ assignedDoctor ? 'Change Doctor' : 'Assign a Doctor' }}
              </a>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Consultations Card -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-calendar-check me-2"></i>
                Upcoming Consultations
              </h5>
              <div class="card-content">
                <div *ngIf="upcomingConsultations.length > 0" class="consultations-list">
                  <div *ngFor="let consultation of upcomingConsultations" class="consultation-item">
                    <div class="consultation-date">
                      {{ consultation.date | date:'MMM d, y, h:mm a' }}
                    </div>
                    <div class="consultation-doctor">
                      {{ consultation.doctorName }}
                    </div>
                    <div class="consultation-status" [ngClass]="{
                      'status-pending': consultation.status === 'pending',
                      'status-accepted': consultation.status === 'accepted'
                    }">
                      {{ consultation.status | titlecase }}
                    </div>
                  </div>
                </div>
                <div *ngIf="upcomingConsultations.length === 0" class="no-consultations-message">
                  <p class="text-muted">No upcoming consultations scheduled.</p>
                </div>
              </div>
              <div class="d-flex gap-2 mt-2">
                <a routerLink="/patient/consultations" class="btn btn-outline-primary flex-grow-1">
                  View All
                </a>
                <a routerLink="/patient/consultations/book" class="btn btn-primary flex-grow-1">
                  Book New
                </a>
              </div>
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
    
    .consultation-doctor {
      color: #495057;
    }
    
    .consultation-status {
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 0.25rem;
    }
    
    .status-pending {
      color: #fd7e14;
    }
    
    .status-accepted {
      color: #20c997;
    }
    
    .no-consultations-message, .no-doctor-message {
      display: flex;
      height: 100%;
      min-height: 100px;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  patient: Patient | null = null;
  assignedDoctor: Doctor | null = null;
  consultations: Consultation[] = [];
  upcomingConsultations: Consultation[] = [];
  
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
    
    this.loadPatientData();
    this.loadAssignedDoctor();
    this.loadConsultations();
  }

  loadPatientData(): void {
    this.patientService.getPatient(this.userId).subscribe(patient => {
      this.patient = patient;
    });
  }

  loadAssignedDoctor(): void {
    this.patientService.getAssignedDoctor(this.userId).subscribe(doctor => {
      this.assignedDoctor = doctor;
    });
  }

  loadConsultations(): void {
    this.patientService.getConsultations(this.userId).subscribe(consultations => {
      this.consultations = consultations;
      
      // Filter upcoming consultations (pending or accepted)
      const now = new Date();
      this.upcomingConsultations = consultations
        .filter(c => new Date(c.date) > now && (c.status === 'pending' || c.status === 'accepted'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); // Show only the next 3 consultations
    });
  }
}