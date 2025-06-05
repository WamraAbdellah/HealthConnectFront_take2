import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Patient } from '../../../services/patient.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-patients',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div class="patients-container">
      <header class="page-header">
        <h1>Patients Management</h1>
        <p class="text-muted">View and manage all patients in the system</p>
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
              {{ searchTerm ? 'No patients match your search criteria.' : 'There are no patients in the system yet.' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Patients Table -->
      <div *ngIf="!loading && filteredPatients.length > 0" class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Blood Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let patient of filteredPatients">
              <td>{{ patient.id }}</td>
              <td>{{ patient.name }}</td>
              <td>{{ patient.email }}</td>
              <td>{{ patient.phone }}</td>
              <td>{{ patient.gender }}</td>
              <td>{{ patient.bloodType }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" (click)="viewPatient(patient)">
                  View
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="removePatient(patient)">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
    
    .no-data-message {
      margin-top: 2rem;
    }
    
    .no-data-icon {
      font-size: 3rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }
    
    .table th {
      font-weight: 600;
      color: #495057;
    }
  `]
})
export class AdminPatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.adminService.getAllPatients().subscribe({
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

  viewPatient(patient: Patient): void {
    // In a real app, this would navigate to a detailed view of the patient
    console.log('View patient:', patient);
  }

  removePatient(patient: Patient): void {
    // In a real app, this would call the API to remove the patient
    // For demo purposes, we'll just update the local state
    this.patients = this.patients.filter(p => p.id !== patient.id);
    this.applyFilter(); // Reapply the filter to update the filteredPatients
  }
}