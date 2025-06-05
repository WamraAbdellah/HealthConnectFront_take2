import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService, Patient, Consultation } from '../../../../services/patient.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="patient-details-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="page-title">Patient Details</h1>
        <a routerLink="/doctor/patients" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left me-2"></i>Back to Patients
        </a>
      </div>
      
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div *ngIf="!loading && patient" class="patient-details">
        <!-- Patient Overview Card -->
        <div class="card overview-card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-2 text-center">
                <div class="patient-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
              </div>
              <div class="col-md-5">
                <h2 class="patient-name">{{ patient.name }}</h2>
                <div class="patient-basic-info">
                  <div><i class="bi bi-gender-ambiguous me-2"></i>{{ patient.gender }}</div>
                  <div><i class="bi bi-calendar3 me-2"></i>{{ patient.dateOfBirth | date }}</div>
                  <div><i class="bi bi-droplet-fill me-2"></i>Blood Type: {{ patient.bloodType }}</div>
                </div>
              </div>
              <div class="col-md-5">
                <div class="patient-contact-info">
                  <div><i class="bi bi-envelope me-2"></i>{{ patient.email }}</div>
                  <div><i class="bi bi-telephone me-2"></i>{{ patient.phone }}</div>
                  <div><i class="bi bi-geo-alt me-2"></i>{{ patient.address }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Medical History Card -->
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Medical History</h3>
          </div>
          <div class="card-body">
            <p *ngIf="patient.medicalHistory">{{ patient.medicalHistory }}</p>
            <p *ngIf="!patient.medicalHistory" class="text-muted">No medical history recorded.</p>
          </div>
        </div>
        
        <!-- Consultation History Card -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title">Consultation History</h3>
          </div>
          <div class="card-body">
            <div *ngIf="consultations.length === 0" class="text-center py-4">
              <p class="text-muted">No consultations recorded for this patient.</p>
            </div>
            
            <div *ngIf="consultations.length > 0" class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let consultation of consultations">
                    <td>{{ consultation.date | date:'MMM d, y, h:mm a' }}</td>
                    <td>{{ consultation.doctorName }}</td>
                    <td>{{ consultation.description }}</td>
                    <td>
                      <span class="consultation-status" [ngClass]="{
                        'status-pending': consultation.status === 'pending',
                        'status-accepted': consultation.status === 'accepted',
                        'status-completed': consultation.status === 'completed',
                        'status-rejected': consultation.status === 'rejected'
                      }">
                        {{ consultation.status | titlecase }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patient-details-container {
      padding: 1rem 0;
    }
    
    .page-title {
      color: #0073e6;
      font-weight: 700;
    }
    
    .overview-card {
      background-color: #f8f9fa;
      border-left: 4px solid #0073e6;
    }
    
    .patient-avatar {
      width: 80px;
      height: 80px;
      background-color: #e9ecef;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    
    .patient-avatar i {
      font-size: 3rem;
      color: #6c757d;
    }
    
    .patient-name {
      font-weight: 600;
      color: #212529;
      margin-bottom: 1rem;
    }
    
    .patient-basic-info, .patient-contact-info {
      margin-bottom: 0.5rem;
      color: #495057;
    }
    
    .patient-basic-info div, .patient-contact-info div {
      margin-bottom: 0.5rem;
    }
    
    .card-title {
      color: #0073e6;
      font-weight: 600;
      margin: 0;
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    
    .consultation-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .status-pending {
      background-color: #fff3cd;
      color: #664d03;
    }
    
    .status-accepted {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    
    .status-completed {
      background-color: #cfe2ff;
      color: #084298;
    }
    
    .status-rejected {
      background-color: #f8d7da;
      color: #842029;
    }
  `]
})
export class PatientDetailsComponent implements OnInit {
  patientId: number = 0;
  patient: Patient | null = null;
  consultations: Consultation[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = +params['id'];
      this.loadPatientData();
    });
  }

  loadPatientData(): void {
    this.loading = true;
    
    // Load patient details
    this.patientService.getPatient(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
        
        // Load consultations for this patient
        this.loadConsultations();
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.loading = false;
      }
    });
  }

  loadConsultations(): void {
    this.patientService.getConsultations(this.patientId).subscribe({
      next: (consultations) => {
        this.consultations = consultations;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
      }
    });
  }
}