import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Patient } from './patient.service';
import { Doctor } from './doctor.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000';
  
  // Mock data for demo purposes
  private mockPatients: Patient[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      dateOfBirth: '1985-05-15',
      gender: 'Male',
      bloodType: 'O+',
      medicalHistory: 'No significant medical history'
    },
    {
      id: 2,
      name: 'Jane Williams',
      email: 'jane.williams@example.com',
      phone: '555-123-4567',
      address: '789 Pine St, Anytown, USA',
      dateOfBirth: '1990-10-20',
      gender: 'Female',
      bloodType: 'A+',
      medicalHistory: 'Allergic to penicillin'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '444-555-6666',
      address: '555 Elm St, Anytown, USA',
      dateOfBirth: '1975-03-08',
      gender: 'Male',
      bloodType: 'B-',
      medicalHistory: 'Hypertension, managed with medication'
    }
  ];
  
  private mockDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      email: 'jane.smith@example.com',
      phone: '987-654-3210',
      address: '456 Oak Ave, Anytown, USA',
      specialization: 'General Practitioner',
      licenseNumber: 'MD123456',
      biography: 'Dr. Smith has been practicing medicine for over 15 years...',
      education: 'Medical School: University of Medicine, Graduated: 2005',
      experience: '15 years of general practice, 5 years as head physician at Anytown Medical Center'
    },
    {
      id: 2,
      name: 'Dr. Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '555-987-6543',
      address: '789 Maple Ave, Anytown, USA',
      specialization: 'Cardiologist',
      licenseNumber: 'MD654321',
      biography: 'Dr. Johnson is a renowned cardiologist with over 20 years of experience...',
      education: 'Medical School: Cardiology Institute, Graduated: 2000',
      experience: '20 years specializing in cardiovascular diseases'
    },
    {
      id: 3,
      name: 'Dr. Sarah Lee',
      email: 'sarah.lee@example.com',
      phone: '333-444-5555',
      address: '123 Cedar St, Anytown, USA',
      specialization: 'Pediatrician',
      licenseNumber: 'MD789012',
      biography: 'Dr. Lee specializes in pediatric care...',
      education: 'Medical School: Children\'s Medical University, Graduated: 2010',
      experience: '12 years in pediatric practice'
    }
  ];

  constructor(private http: HttpClient) { }

  getAllPatients(): Observable<Patient[]> {
    // In a real app: return this.http.get<Patient[]>(`${this.apiUrl}/admin/patients`);
    return of(this.mockPatients);
  }

  getAllDoctors(): Observable<Doctor[]> {
    // In a real app: return this.http.get<Doctor[]>(`${this.apiUrl}/admin/doctors`);
    return of(this.mockDoctors);
  }
}