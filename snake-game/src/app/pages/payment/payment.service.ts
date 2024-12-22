import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface PaymentDetails {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

interface PaymentResponse {
  status: string;
  message: string;
  has_paid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  processPayment(paymentDetails: PaymentDetails): Observable<PaymentResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const paymentData = {
      ...paymentDetails,
      amount: 9.99
    };

    console.log('Sending payment with token:', token); // Debug log
    console.log('Payment data:', paymentData); // Debug log

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/process-payment`, 
      paymentData, 
      { headers }
    ).pipe(
      tap(response => {
        console.log('Payment response:', response); // Debug log
        if (response.status === 'success') {
          localStorage.setItem('paymentStatus', 'true');
        }
      })
    );
  }
}