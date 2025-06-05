import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">HealthConnect</h1>
          <p class="login-subtitle">Medical Platform</p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="Enter your email"
              [ngClass]="{'is-invalid': submitted && f['email'].errors}"
            />
            <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
              <div *ngIf="f['email'].errors['required']">Email is required</div>
              <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Enter your password"
              [ngClass]="{'is-invalid': submitted && f['password'].errors}"
            />
            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
              <div *ngIf="f['password'].errors['required']">Password is required</div>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
            Log In
          </button>
          
          <div *ngIf="error" class="alert alert-danger mt-3">
            {{ error }}
          </div>
          
          <div class="login-hint mt-3">
            <p class="text-center text-muted">
              For demo purposes:<br>
              Email with "patient", "doctor", or "admin" to log in as that role.
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .login-title {
      color: #0073e6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .login-subtitle {
      color: #6c757d;
    }
    
    .login-form {
      margin-bottom: 1rem;
    }
    
    .form-label {
      font-weight: 500;
    }
    
    .btn-primary {
      background-color: #0073e6;
      border-color: #0073e6;
      padding: 0.6rem;
      transition: all 0.2s ease;
    }
    
    .btn-primary:hover {
      background-color: #0060c0;
      border-color: #0060c0;
    }
    
    .login-hint {
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (user) => {
          // Navigate based on user role
          this.router.navigate([`/${user.role}`]);
        },
        error: (error) => {
          this.error = 'Invalid email or password';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}