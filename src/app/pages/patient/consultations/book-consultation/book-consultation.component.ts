import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService, Doctor } from '../../../../services/patient.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-book-consultation',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="book-consultation-container">
      <header class="page-header">
        <h1>Book a Consultation</h1>
        <p class="text-muted">Schedule a new appointment with a doctor</p>
      </header>
      
      <div class="card booking-card">
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <form *ngIf="!loading" [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-12">
                <label for="doctor" class="form-label">Select Doctor</label>
                <select id="doctor" formControlName="doctorId" class="form-select"
                        [ngClass]="{'is-invalid': submitted && f['doctorId'].errors}">
                  <option value="">Select a doctor</option>
                  <option *ngFor="let doctor of doctors" [value]="doctor.id">
                    {{ doctor.name }} - {{ doctor.specialization }}
                  </option>
                </select>
                <div *ngIf="submitted && f['doctorId'].errors" class="invalid-feedback">
                  <div *ngIf="f['doctorId'].errors['required']">Doctor selection is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="date" class="form-label">Date</label>
                <input type="date" id="date" formControlName="date" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['date'].errors}"
                       [min]="minDate">
                <div *ngIf="submitted && f['date'].errors" class="invalid-feedback">
                  <div *ngIf="f['date'].errors['required']">Date is required</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="time" class="form-label">Time</label>
                <input type="time" id="time" formControlName="time" class="form-control"
                       [ngClass]="{'is-invalid': submitted && f['time'].errors}">
                <div *ngIf="submitted && f['time'].errors" class="invalid-feedback">
                  <div *ngIf="f['time'].errors['required']">Time is required</div>
                </div>
              </div>
              
              <div class="col-12">
                <label for="description" class="form-label">Reason for Consultation</label>
                <textarea id="description" formControlName="description" class="form-control" rows="4"
                          placeholder="Describe your symptoms or reason for consultation"></textarea>
              </div>
              
              <div class="col-12 d-flex justify-content-end mt-4">
                <a routerLink="/patient/consultations" class="btn btn-outline-secondary me-2">
                  Cancel
                </a>
                <button type="submit" class="btn btn-primary" [disabled]="booking">
                  <span *ngIf="booking" class="spinner-border spinner-border-sm me-1"></span>
                  Book Consultation
                </button>
              </div>
            </div>
          </form>
          
          <!-- Error Message -->
          <div *ngIf="bookingError" class="alert alert-danger mt-3">
            {{ bookingError }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-consultation-container {
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
    
    .booking-card {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .form-label {
      font-weight: 500;
    }
  `]
})
export class BookConsultationComponent implements OnInit {
  bookingForm: FormGroup;
  doctors: Doctor[] = [];
  loading = false;
  booking = false;
  submitted = false;
  bookingError = '';
  userId: number = 1; // Default for demo
  minDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.bookingForm = this.formBuilder.group({
      doctorId: ['', Validators.required],
      date: [this.minDate, Validators.required],
      time: ['09:00', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
    }
    
    this.loadDoctors();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }

  loadDoctors(): void {
    this.loading = true;
    this.patientService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
        this.bookingError = 'Failed to load doctors. Please try again.';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.bookingError = '';
    
    // Stop if form is invalid
    if (this.bookingForm.invalid) {
      return;
    }
    
    this.booking = true;
    
    // Combine date and time
    const date = this.bookingForm.value.date;
    const time = this.bookingForm.value.time;
    const dateTime = new Date(`${date}T${time}`);
    
    const consultationData = {
      doctorId: Number(this.bookingForm.value.doctorId),
      date: dateTime.toISOString(),
      description: this.bookingForm.value.description
    };
    
    this.patientService.bookConsultation(this.userId, consultationData).subscribe({
      next: () => {
        this.booking = false;
        // Navigate to consultations list
        this.router.navigate(['/patient/consultations']);
      },
      error: (error) => {
        console.error('Error booking consultation:', error);
        this.bookingError = 'Failed to book consultation. Please try again.';
        this.booking = false;
      }
    });
  }
}