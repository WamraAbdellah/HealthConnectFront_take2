import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService, Patient } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <h1>My Profile</h1>
        <p class="text-muted">Manage your personal information</p>
      </header>
      
      <div class="card profile-card">
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <form *ngIf="!loading" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <!-- Personal Information Section -->
              <div class="col-12">
                <h3 class="section-title">Personal Information</h3>
              </div>
              
              <div class="col-md-6">
                <label for="name" class="form-label">Full Name</label>
                <input type="text" id="name" formControlName="name" class="form-control" 
                       [ngClass]="{'is-invalid': submitted && f['name'].errors}">
                <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                  <div *ngIf="f['name'].errors['required']">Name is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['email'].errors}">
                <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                  <div *ngIf="f['email'].errors['required']">Email is required</div>
                  <div *ngIf="f['email'].errors['email']">Email must be a valid email address</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" id="phone" formControlName="phone" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['phone'].errors}">
                <div *ngIf="submitted && f['phone'].errors" class="invalid-feedback">
                  <div *ngIf="f['phone'].errors['required']">Phone number is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="dateOfBirth" class="form-label">Date of Birth</label>
                <input type="date" id="dateOfBirth" formControlName="dateOfBirth" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['dateOfBirth'].errors}">
                <div *ngIf="submitted && f['dateOfBirth'].errors" class="invalid-feedback">
                  <div *ngIf="f['dateOfBirth'].errors['required']">Date of birth is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="gender" class="form-label">Gender</label>
                <select id="gender" formControlName="gender" class="form-select"
                        [ngClass]="{'is-invalid': submitted && f['gender'].errors}">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div *ngIf="submitted && f['gender'].errors" class="invalid-feedback">
                  <div *ngIf="f['gender'].errors['required']">Gender is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="bloodType" class="form-label">Blood Type</label>
                <select id="bloodType" formControlName="bloodType" class="form-select"
                        [ngClass]="{'is-invalid': submitted && f['bloodType'].errors}">
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <div *ngIf="submitted && f['bloodType'].errors" class="invalid-feedback">
                  <div *ngIf="f['bloodType'].errors['required']">Blood type is required</div>
                </div>
              </div>
              
              <!-- Address Section -->
              <div class="col-12">
                <h3 class="section-title mt-3">Address</h3>
              </div>
              
              <div class="col-12">
                <label for="address" class="form-label">Street Address</label>
                <input type="text" id="address" formControlName="address" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['address'].errors}">
                <div *ngIf="submitted && f['address'].errors" class="invalid-feedback">
                  <div *ngIf="f['address'].errors['required']">Address is required</div>
                </div>
              </div>
              
              <!-- Medical Information Section -->
              <div class="col-12">
                <h3 class="section-title mt-3">Medical Information</h3>
              </div>
              
              <div class="col-12">
                <label for="medicalHistory" class="form-label">Medical History</label>
                <textarea id="medicalHistory" formControlName="medicalHistory" class="form-control" rows="4"></textarea>
              </div>
              
              <!-- Submit Buttons -->
              <div class="col-12 d-flex justify-content-end mt-4">
                <button type="button" class="btn btn-outline-secondary me-2" (click)="resetForm()">
                  Reset
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="updating">
                  <span *ngIf="updating" class="spinner-border spinner-border-sm me-1"></span>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
          
          <!-- Success Message -->
          <div *ngIf="updateSuccess" class="alert alert-success mt-3">
            Profile updated successfully!
          </div>
          
          <!-- Error Message -->
          <div *ngIf="updateError" class="alert alert-danger mt-3">
            {{ updateError }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 1rem 0;
    }
    
    .profile-header {
      margin-bottom: 2rem;
    }
    
    .profile-header h1 {
      color: #0073e6;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .profile-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .section-title {
      color: #0073e6;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .form-label {
      font-weight: 500;
    }
  `]
})
export class PatientProfileComponent implements OnInit {
  profileForm: FormGroup;
  patient: Patient | null = null;
  userId: number = 1; // Default for demo
  
  loading = false;
  updating = false;
  submitted = false;
  updateSuccess = false;
  updateError = '';

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      bloodType: ['', Validators.required],
      medicalHistory: ['']
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
    }
    
    this.loadPatientData();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  loadPatientData(): void {
    this.loading = true;
    this.patientService.getPatient(this.userId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.profileForm.patchValue({
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodType: patient.bloodType,
          medicalHistory: patient.medicalHistory
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient data:', error);
        this.loading = false;
        this.updateError = 'Failed to load profile data. Please try again.';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.updateSuccess = false;
    this.updateError = '';
    
    // Stop if form is invalid
    if (this.profileForm.invalid) {
      return;
    }
    
    this.updating = true;
    
    this.patientService.updatePatient(this.userId, this.profileForm.value).subscribe({
      next: (updatedPatient) => {
        this.patient = updatedPatient;
        this.updateSuccess = true;
        this.updating = false;
        this.submitted = false;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating patient data:', error);
        this.updateError = 'Failed to update profile. Please try again.';
        this.updating = false;
      }
    });
  }

  resetForm(): void {
    if (this.patient) {
      this.profileForm.patchValue({
        name: this.patient.name,
        email: this.patient.email,
        phone: this.patient.phone,
        address: this.patient.address,
        dateOfBirth: this.patient.dateOfBirth,
        gender: this.patient.gender,
        bloodType: this.patient.bloodType,
        medicalHistory: this.patient.medicalHistory
      });
    }
    this.submitted = false;
    this.updateSuccess = false;
    this.updateError = '';
  }
}