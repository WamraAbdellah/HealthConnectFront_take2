import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService, Doctor } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <h1>My Profile</h1>
        <p class="text-muted">Manage your professional information</p>
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
                <label for="address" class="form-label">Address</label>
                <input type="text" id="address" formControlName="address" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['address'].errors}">
                <div *ngIf="submitted && f['address'].errors" class="invalid-feedback">
                  <div *ngIf="f['address'].errors['required']">Address is required</div>
                </div>
              </div>
              
              <!-- Professional Information Section -->
              <div class="col-12">
                <h3 class="section-title mt-3">Professional Information</h3>
              </div>
              
              <div class="col-md-6">
                <label for="specialization" class="form-label">Specialization</label>
                <input type="text" id="specialization" formControlName="specialization" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['specialization'].errors}">
                <div *ngIf="submitted && f['specialization'].errors" class="invalid-feedback">
                  <div *ngIf="f['specialization'].errors['required']">Specialization is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="licenseNumber" class="form-label">License Number</label>
                <input type="text" id="licenseNumber" formControlName="licenseNumber" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['licenseNumber'].errors}">
                <div *ngIf="submitted && f['licenseNumber'].errors" class="invalid-feedback">
                  <div *ngIf="f['licenseNumber'].errors['required']">License number is required</div>
                </div>
              </div>
              
              <div class="col-12">
                <label for="biography" class="form-label">Biography</label>
                <textarea id="biography" formControlName="biography" class="form-control" rows="3"></textarea>
              </div>
              
              <div class="col-md-6">
                <label for="education" class="form-label">Education</label>
                <textarea id="education" formControlName="education" class="form-control" rows="3"></textarea>
              </div>
              
              <div class="col-md-6">
                <label for="experience" class="form-label">Experience</label>
                <textarea id="experience" formControlName="experience" class="form-control" rows="3"></textarea>
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
export class DoctorProfileComponent implements OnInit {
  profileForm: FormGroup;
  doctor: Doctor | null = null;
  doctorId: number = 1; // Default for demo
  
  loading = false;
  updating = false;
  submitted = false;
  updateSuccess = false;
  updateError = '';

  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      specialization: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      biography: [''],
      education: [''],
      experience: ['']
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.doctorId = currentUser.id;
    }
    
    this.loadDoctorData();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  loadDoctorData(): void {
    this.loading = true;
    this.doctorService.getDoctor(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.profileForm.patchValue({
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          address: doctor.address,
          specialization: doctor.specialization,
          licenseNumber: doctor.licenseNumber,
          biography: doctor.biography,
          education: doctor.education,
          experience: doctor.experience
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctor data:', error);
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
    
    this.doctorService.updateDoctor(this.doctorId, this.profileForm.value).subscribe({
      next: (updatedDoctor) => {
        this.doctor = updatedDoctor;
        this.updateSuccess = true;
        this.updating = false;
        this.submitted = false;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating doctor data:', error);
        this.updateError = 'Failed to update profile. Please try again.';
        this.updating = false;
      }
    });
  }

  resetForm(): void {
    if (this.doctor) {
      this.profileForm.patchValue({
        name: this.doctor.name,
        email: this.doctor.email,
        phone: this.doctor.phone,
        address: this.doctor.address,
        specialization: this.doctor.specialization,
        licenseNumber: this.doctor.licenseNumber,
        biography: this.doctor.biography,
        education: this.doctor.education,
        experience: this.doctor.experience
      });
    }
    this.submitted = false;
    this.updateSuccess = false;
    this.updateError = '';
  }
}