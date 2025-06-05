import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Patient } from './patient.service';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
  licenseNumber: string;
  biography: string;
  education: string;
  experience: string;
}

export interface Consultation {
  id: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  date: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5000';
  
  // Mock data for demo purposes
  private mockDoctor: Doctor = {
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
  };
  
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
  
  private mockConsultations: Consultation[] = [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      patientName: 'John Doe',
      date: '2023-05-15T10:00:00',
      description: 'Annual checkup',
      status: 'completed'
    },
    {
      id: 2,
      patientId: 2,
      doctorId: 1,
      patientName: 'Jane Williams',
      date: '2023-06-20T14:30:00',
      description: 'Follow-up appointment',
      status: 'accepted'
    },
    {
      id: 3,
      patientId: 3,
      doctorId: 1,
      patientName: 'Michael Brown',
      date: '2023-07-10T09:15:00',
      description: 'Consultation for headaches',
      status: 'pending'
    }
  ];

  constructor(private http: HttpClient) { }

  getDoctor(id: number): Observable<Doctor> {
    // In a real app: return this.http.get<Doctor>(`${this.apiUrl}/doctor/${id}`);
    return of(this.mockDoctor);
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    // In a real app: return this.http.put<Doctor>(`${this.apiUrl}/doctor/${id}`, doctor);
    this.mockDoctor = { ...this.mockDoctor, ...doctor };
    return of(this.mockDoctor);
  }

  getPatients(doctorId: number): Observable<Patient[]> {
    // In a real app: return this.http.get<Patient[]>(`${this.apiUrl}/doctor/${doctorId}/patients`);
    return of(this.mockPatients);
  }

  getConsultations(doctorId: number): Observable<Consultation[]> {
    // In a real app: return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations`);
    return of(this.mockConsultations);
  }

  getPendingConsultations(doctorId: number): Observable<Consultation[]> {
    // In a real app: return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}/consultations/pending`);
    return of(this.mockConsultations.filter(c => c.status === 'pending'));
  }

  acceptConsultation(doctorId: number, consultationId: number): Observable<Consultation> {
    // In a real app: return this.http.post<Consultation>(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/accept`, {});
    const consultation = this.mockConsultations.find(c => c.id === consultationId);
    if (consultation) {
      consultation.status = 'accepted';
    }
    return of(consultation!);
  }

  rejectConsultation(doctorId: number, consultationId: number): Observable<Consultation> {
    // In a real app: return this.http.post<Consultation>(`${this.apiUrl}/doctor/${doctorId}/consultations/${consultationId}/reject`, {});
    const consultation = this.mockConsultations.find(c => c.id === consultationId);
    if (consultation) {
      consultation.status = 'rejected';
    }
    return of(consultation!);
  }
}