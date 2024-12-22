import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Your Laravel API base URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  // Register a new user
  register(user: { username: string; email: string; password: string; password_confirmation: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Login a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Save JWT Token
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get JWT Token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout User
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
