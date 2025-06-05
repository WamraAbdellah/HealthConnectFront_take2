import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Doctor } from '../../../services/doctor.service';

@Component({
  selector: 'app-admin-doctors',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <div class="doctors-container">
      <header class="page-header">
        <h1>Doctors Management</h1>
        <p class="text-muted">View and manage all doctors in the system</p>
      </header>
      
      <!-- Search and Filter -->
      <div class="card search-card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Search doctors..." 
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
      
      <!-- No Doctors Message -->
      <div *ngIf="!loading && filteredDoctors.length === 0" class="no-data-message">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-people no-data-icon"></i>
            <h3>No doctors found</h3>
            <p class="text-muted">
              {{ searchTerm ? 'No doctors match your search criteria.' : 'There are no doctors in the system yet.' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Doctors Table -->
      <div *ngIf="!loading && filteredDoctors.length > 0" class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doctor of filteredDoctors">
              <td>{{ doctor.id }}</td>
              <td>{{ doctor.name }}</td>
              <td>{{ doctor.specialization }}</td>
              <td>{{ doctor.email }}</td>
              <td>{{ doctor.phone }}</td>
              <td>{{ doctor.licenseNumber }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" (click)="viewDoctor(doctor)">
                  View
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="removeDoctor(doctor)">
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
export class AdminDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  loading = false;
  searchTerm = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.adminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = this.doctors;
      return;
    }
    
    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.specialization.toLowerCase().includes(searchTerm) ||
      doctor.email.toLowerCase().includes(searchTerm) ||
      doctor.phone.toLowerCase().includes(searchTerm) ||
      doctor.licenseNumber.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDoctors = this.doctors;
  }

  viewDoctor(doctor: Doctor): void {
    // In a real app, this would navigate to a detailed view of the doctor
    console.log('View doctor:', doctor);
  }

  removeDoctor(doctor: Doctor): void {
    // In a real app, this would call the API to remove the doctor
    // For demo purposes, we'll just update the local state
    this.doctors = this.doctors.filter(d => d.id !== doctor.id);
    this.applyFilter(); // Reapply the filter to update the filteredDoctors
  }
}