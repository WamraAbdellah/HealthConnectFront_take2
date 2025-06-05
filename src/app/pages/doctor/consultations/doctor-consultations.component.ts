import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService, Consultation } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-consultations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="consultations-container">
      <header class="page-header">
        <h1>Consultations</h1>
        <p class="text-muted">Manage your medical appointments with patients</p>
      </header>
      
      <!-- Consultations Tabs -->
      <ul class="nav nav-tabs consultations-tabs">
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'pending'" (click)="setActiveTab('pending')">
            Pending <span *ngIf="pendingCount > 0" class="badge bg-danger ms-1">{{ pendingCount }}</span>
          </a>
        </li>
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
                  <div class="consultation-patient">
                    <strong>Patient:</strong> {{ consultation.patientName }}
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
                    <button *ngIf="consultation.status === 'pending'" 
                            class="btn btn-sm btn-success me-2"
                            [disabled]="processingConsultation === consultation.id" 
                            (click)="acceptConsultation(consultation)">
                      <span *ngIf="processingConsultation === consultation.id" class="spinner-border spinner-border-sm me-1"></span>
                      Accept
                    </button>
                    <button *ngIf="consultation.status === 'pending'" 
                            class="btn btn-sm btn-danger"
                            [disabled]="processingConsultation === consultation.id" 
                            (click)="rejectConsultation(consultation)">
                      Reject
                    </button>
                    <button *ngIf="consultation.status === 'accepted' && isUpcoming(consultation.date)" 
                            class="btn btn-sm btn-outline-primary"
                            (click)="markAsComplete(consultation)">
                      Mark as Complete
                    </button>
                    <button *ngIf="consultation.status === 'completed'" 
                            class="btn btn-sm btn-outline-secondary"
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
    
    .page-header {
      margin-bottom: 2rem;
    }
    
    .page-header h1 {
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
    
    .consultation-patient {
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
export class DoctorConsultationsComponent implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  activeTab: 'pending' | 'upcoming' | 'past' | 'all' = 'pending';
  loading = false;
  doctorId: number = 1; // Default for demo
  pendingCount = 0;
  processingConsultation: number | null = null;
  
  noDataMessage = 'You have no pending consultations.';

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.doctorId = currentUser.id;
    }
    
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.loading = true;
    this.doctorService.getConsultations(this.doctorId).subscribe({
      next: (consultations) => {
        this.consultations = consultations;
        this.pendingCount = consultations.filter(c => c.status === 'pending').length;
        this.filterConsultations();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: 'pending' | 'upcoming' | 'past' | 'all'): void {
    this.activeTab = tab;
    this.filterConsultations();
  }

  filterConsultations(): void {
    const now = new Date();
    
    switch (this.activeTab) {
      case 'pending':
        this.filteredConsultations = this.consultations.filter(c => c.status === 'pending');
        this.noDataMessage = 'You have no pending consultations.';
        break;
      
      case 'upcoming':
        this.filteredConsultations = this.consultations.filter(c => 
          new Date(c.date) >= now && c.status === 'accepted'
        );
        this.noDataMessage = 'You have no upcoming consultations.';
        break;
      
      case 'past':
        this.filteredConsultations = this.consultations.filter(c => 
          new Date(c.date) < now || c.status === 'completed' || c.status === 'rejected'
        );
        this.noDataMessage = 'You have no past consultations.';
        break;
      
      case 'all':
        this.filteredConsultations = this.consultations;
        this.noDataMessage = 'You have no consultations yet.';
        break;
    }
    
    // Sort by date, newest first for past, oldest first for pending and upcoming
    if (this.activeTab === 'past') {
      this.filteredConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      this.filteredConsultations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }

  acceptConsultation(consultation: Consultation): void {
    this.processingConsultation = consultation.id;
    
    this.doctorService.acceptConsultation(this.doctorId, consultation.id).subscribe({
      next: (updatedConsultation) => {
        // Update the consultation in the list
        const index = this.consultations.findIndex(c => c.id === consultation.id);
        if (index !== -1) {
          this.consultations[index] = updatedConsultation;
        }
        
        this.pendingCount = this.consultations.filter(c => c.status === 'pending').length;
        this.filterConsultations();
        this.processingConsultation = null;
      },
      error: (error) => {
        console.error('Error accepting consultation:', error);
        this.processingConsultation = null;
      }
    });
  }

  rejectConsultation(consultation: Consultation): void {
    this.processingConsultation = consultation.id;
    
    this.doctorService.rejectConsultation(this.doctorId, consultation.id).subscribe({
      next: (updatedConsultation) => {
        // Update the consultation in the list
        const index = this.consultations.findIndex(c => c.id === consultation.id);
        if (index !== -1) {
          this.consultations[index] = updatedConsultation;
        }
        
        this.pendingCount = this.consultations.filter(c => c.status === 'pending').length;
        this.filterConsultations();
        this.processingConsultation = null;
      },
      error: (error) => {
        console.error('Error rejecting consultation:', error);
        this.processingConsultation = null;
      }
    });
  }

  markAsComplete(consultation: Consultation): void {
    // In a real app, this would call the API to mark the consultation as completed
    // For demo purposes, we'll just update the local state
    consultation.status = 'completed';
    this.filterConsultations();
  }

  viewDetails(consultation: Consultation): void {
    // In a real app, this would navigate to a detailed view of the consultation
    console.log('View details for consultation:', consultation);
  }

  isUpcoming(date: string): boolean {
    return new Date(date) > new Date();
  }
}