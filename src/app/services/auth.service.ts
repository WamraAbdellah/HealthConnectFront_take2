import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:5000';
  
  // Mock user for demonstration
  private mockUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Check local storage for saved user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // In a real app, this would call the backend API
    // For demo purposes, we're setting mock users based on email
    
    if (email.includes('patient')) {
      this.mockUser = { id: 1, email, role: 'patient' };
    } else if (email.includes('doctor')) {
      this.mockUser = { id: 1, email, role: 'doctor' };
    } else if (email.includes('admin')) {
      this.mockUser = { id: 1, email, role: 'admin' };
    } else {
      // Default to patient for any other email
      this.mockUser = { id: 1, email, role: 'patient' };
    }

    // Store user in localStorage and update subject
    localStorage.setItem('currentUser', JSON.stringify(this.mockUser));
    this.currentUserSubject.next(this.mockUser);
    
    // Return mock observable
    return of(this.mockUser);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  hasRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole !== null && allowedRoles.includes(userRole);
  }
}