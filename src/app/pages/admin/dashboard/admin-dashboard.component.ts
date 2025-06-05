import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Patient } from '../../../services/patient.service';
import { Doctor } from '../../../services/doctor.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p class="text-muted">Manage the HealthConnect platform</p>
      </header>
      
      <div class="row g-4">
        <!-- Users Summary -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-people-fill me-2"></i>
                Users Summary
              </h5>
              <div class="users-summary mt-4">
                <div class="row text-center">
                  <div class="col-6">
                    <div class="summary-card patients-card">
                      <div class="summary-icon">
                        <i class="bi bi-person"></i>
                      </div>
                      <div class="summary-count">{{ patients.length }}</div>
                      <div class="summary-label">Patients</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="summary-card doctors-card">
                      <div class="summary-icon">
                        <i class="bi bi-person-badge"></i>
                      </div>
                      <div class="summary-count">{{ doctors.length }}</div>
                      <div class="summary-label">Doctors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Patients -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-person me-2"></i>
                Recent Patients
              </h5>
              <div class="list-group recent-list">
                <div *ngFor="let patient of recentPatients" class="list-group-item list-group-item-action">
                  <div class="d-flex justify-content-between">
                    <div>
                      <div class="fw-bold">{{ patient.name }}</div>
                      <small>{{ patient.email }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <a routerLink="/admin/patients" class="btn btn-outline-primary w-100 mt-3">
                View All Patients
              </a>
            </div>
          </div>
        </div>
        
        <!-- Recent Doctors -->
        <div class="col-md-6 col-lg-4">
          <div class="card dashboard-card h-100">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-person-badge me-2"></i>
                Recent Doctors
              </h5>
              <div class="list-group recent-list">
                <div *ngFor="let doctor of recentDoctors" class="list-group-item list-group-item-action">
                  <div class="d-flex justify-content-between">
                    <div>
                      <div class="fw-bold">{{ doctor.name }}</div>
                      <small>{{ doctor.specialization }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <a routerLink="/admin/doctors" class="btn btn-outline-primary w-100 mt-3">
                View All Doctors
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
    
    .users-summary {
      margin-bottom: 1rem;
    }
    
    .summary-card {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    
    .patients-card {
      background-color: #f0f8ff;
    }
    
    .doctors-card {
      background-color: #f0fff4;
    }
    
    .summary-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #0073e6;
    }
    
    .summary-count {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    
    .summary-label {
      color: #6c757d;
      font-weight: 500;
    }
    
    .recent-list {
      max-height: 250px;
      overflow-y: auto;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  recentPatients: Patient[] = [];
  recentDoctors: Doctor[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load patients
    this.adminService.getAllPatients().subscribe(patients => {
      this.patients = patients;
      this.recentPatients = patients.slice(0, 5); // Show only 5 most recent patients
    });
    
    // Load doctors
    this.adminService.getAllDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.recentDoctors = doctors.slice(0, 5); // Show only 5 most recent doctors
    });
  }
}