import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService, Consultation } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-consultations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="consultations-container">
      <header class="consultations-header">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1>My Consultations</h1>
            <p class="text-muted">Manage your medical appointments</p>
          </div>
          <div>
            <a routerLink="/patient/consultations/book" class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Book New Consultation
            </a>
          </div>
        </div>
      </header>
      
      <!-- Consultations Tabs -->
      <ul class="nav nav-tabs consultations-tabs">
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'upcoming'" (click)="setActiveTab('upcoming')">
            Upcoming
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'past'" (click)="setActiveTab('past')">
            Past
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'all'" (click)="setActiveTab('all')">
            All
          </a>
        </li>
      </ul>
      
      <!-- Loading Indicator -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <!-- No Consultations Message -->
      <div *ngIf="!loading && filteredConsultations.length === 0" class="no-data-message">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-calendar-x no-data-icon"></i>
            <h3>No consultations found</h3>
            <p class="text-muted">
              {{ noDataMessage }}
            </p>
            <a routerLink="/patient/consultations/book" class="btn btn-primary mt-3">
              Book a Consultation
            </a>
          </div>
        </div>
      </div>
      
      <!-- Consultations List -->
      <div *ngIf="!loading && filteredConsultations.length > 0" class="consultations-list">
        <div class="card mb-3" *ngFor="let consultation of filteredConsultations">
          <div class="card-body">
            <div class="consultation-item">
              <div class="row g-3">
                <div class="col-md-2">
                  <div class="consultation-date">
                    <div class="date-day">{{ consultation.date | date:'dd' }}</div>
                    <div class="date-month">{{ consultation.date | date:'MMM' }}</div>
                    <div class="date-year">{{ consultation.date | date:'yyyy' }}</div>
                  </div>
                  <div class="consultation-time">
                    {{ consultation.date | date:'h:mm a' }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="consultation-doctor">
                    <strong>Doctor:</strong> {{ consultation.doctorName }}
                  </div>
                  <div class="consultation-description" *ngIf="consultation.description">
                    <strong>Reason:</strong> {{ consultation.description }}
                  </div>
                </div>
                
                <div class="col-md-4 d-flex flex-column justify-content-between">
                  <div class="consultation-status-container text-end">
                    <span class="consultation-status" [ngClass]="{
                      'status-pending': consultation.status === 'pending',
                      'status-accepted': consultation.status === 'accepted',
                      'status-completed': consultation.status === 'completed',
                      'status-rejected': consultation.status === 'rejected'
                    }">
                      {{ consultation.status | titlecase }}
                    </span>
                  </div>
                  
                  <div class="consultation-actions text-end mt-2">
                    <button class="btn btn-sm btn-outline-danger" 
                            *ngIf="consultation.status === 'pending' || consultation.status === 'accepted'"
                            (click)="cancelConsultation(consultation)">
                      Cancel
                    </button>
                    <button class="btn btn-sm btn-outline-primary ms-2" 
                            *ngIf="consultation.status === 'completed'"
                            (click)="viewDetails(consultation)">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .consultations-container {
      padding: 1rem 0;
    }
    
    .consultations-header {
      margin-bottom: 2rem;
    }
    
    .consultations-header h1 {
      color: #0073e6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .consultations-tabs {
      margin-bottom: 1.5rem;
    }
    
    .consultations-tabs .nav-link {
      color: #6c757d;
      font-weight: 500;
      cursor: pointer;
    }
    
    .consultations-tabs .nav-link.active {
      color: #0073e6;
      font-weight: 600;
    }
    
    .consultation-item {
      position: relative;
    }
    
    .consultation-date {
      text-align: center;
      padding: 0.5rem;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    .date-day {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
    }
    
    .date-month {
      font-weight: 600;
      color: #0073e6;
    }
    
    .date-year {
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .consultation-time {
      text-align: center;
      margin-top: 0.5rem;
      font-weight: 500;
    }
    
    .consultation-doctor {
      margin-bottom: 0.5rem;
    }
    
    .consultation-description {
      color: #6c757d;
    }
    
    .consultation-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.875rem;
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
export class PatientConsultationsComponent implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  activeTab: 'upcoming' | 'past' | 'all' = 'upcoming';
  loading = false;
  userId: number = 1; // Default for demo
  
  noDataMessage = 'You have no upcoming consultations. Book a new consultation to get started.';

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
    }
    
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.loading = true;
    this.patientService.getConsultations(this.userId).subscribe({
      next: (consultations) => {
        this.consultations = consultations;
        this.filterConsultations();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'upcoming' | 'past' | 'all'): void {
    this.activeTab = tab;
    this.filterConsultations();
  }

  filterConsultations(): void {
    const now = new Date();
    
    switch (this.activeTab) {
      case 'upcoming':
        this.filteredConsultations = this.consultations.filter(c => 
          new Date(c.date) >= now && (c.status === 'pending' || c.status === 'accepted')
        );
        this.noDataMessage = 'You have no upcoming consultations. Book a new consultation to get started.';
        break;
      
      case 'past':
        this.filteredConsultations = this.consultations.filter(c => 
          new Date(c.date) < now || c.status === 'completed' || c.status === 'rejected'
        );
        this.noDataMessage = 'You have no past consultations.';
        break;
      
      case 'all':
        this.filteredConsultations = this.consultations;
        this.noDataMessage = 'You have no consultations yet. Book a new consultation to get started.';
        break;
    }
    
    // Sort by date, newest first
    this.filteredConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  cancelConsultation(consultation: Consultation): void {
    // In a real app, this would call the API to cancel the consultation
    // For demo purposes, we'll just update the local state
    consultation.status = 'rejected';
    this.filterConsultations();
  }

  viewDetails(consultation: Consultation): void {
    // In a real app, this would navigate to a detailed view of the consultation
    console.log('View details for consultation:', consultation);
  }
}