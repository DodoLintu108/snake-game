import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  
  // Observable for components to subscribe to
  authStatus = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists on service initialization
    this.loggedIn.next(this.isLoggedIn());
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response.authorization?.token) {
            // Store token and user data
            localStorage.setItem('token', response.authorization.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Store payment status if it exists
            if (response.user?.has_paid !== undefined) {
              localStorage.setItem('paymentStatus', response.user.has_paid ? 'true' : 'false');
            }

            // Update logged in status
            this.loggedIn.next(true);

            // Store session data
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }

  register(userData: {username: string, email: string, password: string, password_confirmation: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Clear all stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('paymentStatus');
        sessionStorage.clear();
        
        // Update logged in status
        this.loggedIn.next(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get current auth status
  getAuthStatus(): Observable<boolean> {
    return this.authStatus;
  }

  // Payment related methods
  checkPaymentStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-payment-status`).pipe(
      tap((response: any) => {
        if (response.has_paid !== undefined) {
          localStorage.setItem('paymentStatus', response.has_paid ? 'true' : 'false');
        }
      })
    );
  }

  hasUserPaid(): boolean {
    return localStorage.getItem('paymentStatus') === 'true';
  }

  updatePaymentStatus(status: boolean): void {
    localStorage.setItem('paymentStatus', status ? 'true' : 'false');
  }

  // HTTP interceptor handling
  private addAuthHeader(headers: any = {}): any {
    const token = this.getToken();
    if (token) {
      return {
        ...headers,
        Authorization: `Bearer ${token}`
      };
    }
    return headers;
  }

  // Method to refresh token if needed
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {}, {
      headers: this.addAuthHeader()
    });
  }
}