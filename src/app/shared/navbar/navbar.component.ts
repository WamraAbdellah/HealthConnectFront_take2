import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <span class="brand-text">HealthConnect</span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto" *ngIf="currentUser">
            <!-- Patient Navigation -->
            <ng-container *ngIf="currentUser.role === 'patient'">
              <li class="nav-item">
                <a class="nav-link" routerLink="/patient" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/patient/profile" routerLinkActive="active">Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/patient/consultations" routerLinkActive="active">Consultations</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/patient/doctors" routerLinkActive="active">Doctors</a>
              </li>
            </ng-container>
            
            <!-- Doctor Navigation -->
            <ng-container *ngIf="currentUser.role === 'doctor'">
              <li class="nav-item">
                <a class="nav-link" routerLink="/doctor" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/doctor/profile" routerLinkActive="active">Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/doctor/patients" routerLinkActive="active">Patients</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/doctor/consultations" routerLinkActive="active">Consultations</a>
              </li>
            </ng-container>
            
            <!-- Admin Navigation -->
            <ng-container *ngIf="currentUser.role === 'admin'">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/patients" routerLinkActive="active">Patients</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/doctors" routerLinkActive="active">Doctors</a>
              </li>
            </ng-container>
            
            <!-- Logout Button -->
            <li class="nav-item">
              <button class="btn btn-outline-primary ms-2" (click)="logout()">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      padding: 0.8rem 1rem;
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
    }
    
    .brand-text {
      font-weight: 700;
      font-size: 1.5rem;
      color: #0073e6;
      margin-left: 0.5rem;
    }
    
    .nav-link {
      font-weight: 500;
      color: #495057;
      padding: 0.5rem 1rem;
      margin: 0 0.2rem;
      transition: all 0.2s ease;
    }
    
    .nav-link:hover {
      color: #0073e6;
    }
    
    .nav-link.active {
      color: #0073e6;
      background-color: rgba(0, 115, 230, 0.08);
      border-radius: 4px;
    }
    
    .btn-outline-primary {
      border-color: #0073e6;
      color: #0073e6;
    }
    
    .btn-outline-primary:hover {
      background-color: #0073e6;
      color: white;
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}