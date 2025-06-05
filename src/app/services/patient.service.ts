import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  medicalHistory: string;
}

export interface Consultation {
  id: number;
  patientId: number;
  doctorId: number;
  doctorName?: string;
  date: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:5000';
  
  // Mock data for demo purposes
  private mockPatient: Patient = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    bloodType: 'O+',
    medicalHistory: 'No significant medical history'
  };
  
  private mockConsultations: Consultation[] = [
    {
      id: 1,
      patientId: 1,
      doctorId: 1,
      doctorName: 'Dr. Jane Smith',
      date: '2023-05-15T10:00:00',
      description: 'Annual checkup',
      status: 'completed'
    },
    {
      id: 2,
      patientId: 1,
      doctorId: 2,
      doctorName: 'Dr. Robert Johnson',
      date: '2023-06-20T14:30:00',
      description: 'Follow-up appointment',
      status: 'accepted'
    },
    {
      id: 3,
      patientId: 1,
      doctorId: 1,
      doctorName: 'Dr. Jane Smith',
      date: '2023-07-10T09:15:00',
      description: 'Consultation for headaches',
      status: 'pending'
    }
  ];
  
  private mockDoctor: Doctor = {
    id: 1,
    name: 'Dr. Jane Smith',
    specialization: 'General Practitioner',
    email: 'jane.smith@example.com',
    phone: '987-654-3210'
  };
  
  private mockDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      specialization: 'General Practitioner',
      email: 'jane.smith@example.com',
      phone: '987-654-3210'
    },
    {
      id: 2,
      name: 'Dr. Robert Johnson',
      specialization: 'Cardiologist',
      email: 'robert.johnson@example.com',
      phone: '555-123-4567'
    },
    {
      id: 3,
      name: 'Dr. Sarah Lee',
      specialization: 'Pediatrician',
      email: 'sarah.lee@example.com',
      phone: '444-555-6666'
    }
  ];

  constructor(private http: HttpClient) { }

  getPatient(id: number): Observable<Patient> {
    // In a real app: return this.http.get<Patient>(`${this.apiUrl}/patient/${id}`);
    return of(this.mockPatient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    // In a real app: return this.http.put<Patient>(`${this.apiUrl}/patient/${id}`, patient);
    this.mockPatient = { ...this.mockPatient, ...patient };
    return of(this.mockPatient);
  }

  getConsultations(patientId: number): Observable<Consultation[]> {
    // In a real app: return this.http.get<Consultation[]>(`${this.apiUrl}/patient/${patientId}/consultations`);
    return of(this.mockConsultations);
  }

  bookConsultation(patientId: number, consultation: Partial<Consultation>): Observable<Consultation> {
    // In a real app: return this.http.post<Consultation>(`${this.apiUrl}/patient/${patientId}/consultations`, consultation);
    const newConsultation: Consultation = {
      id: this.mockConsultations.length + 1,
      patientId,
      doctorId: consultation.doctorId!,
      doctorName: this.mockDoctors.find(d => d.id === consultation.doctorId)?.name,
      date: consultation.date!,
      description: consultation.description || '',
      status: 'pending'
    };
    this.mockConsultations.push(newConsultation);
    return of(newConsultation);
  }

  getAssignedDoctor(patientId: number): Observable<Doctor> {
    // In a real app: return this.http.get<Doctor>(`${this.apiUrl}/patient/${patientId}/doctor`);
    return of(this.mockDoctor);
  }

  assignDoctor(patientId: number, doctorId: number): Observable<any> {
    // In a real app: return this.http.post<any>(`${this.apiUrl}/patient/${patientId}/assign-doctor/${doctorId}`, {});
    this.mockDoctor = this.mockDoctors.find(d => d.id === doctorId) || this.mockDoctor;
    return of({ success: true });
  }

  getAllDoctors(): Observable<Doctor[]> {
    // In a real app: return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
    return of(this.mockDoctors);
  }
}