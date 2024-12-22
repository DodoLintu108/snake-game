import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentForm: FormGroup;
  error: string | null = null;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  processPayment(): void {
    if (this.paymentForm.valid) {
      this.processing = true;
      this.error = null;

      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'Please log in to make a payment';
        this.router.navigate(['/login']);
        return;
      }

      console.log('Processing payment with form data:', this.paymentForm.value); // Debug log

      this.paymentService.processPayment(this.paymentForm.value).subscribe({
        next: (response) => {
          console.log('Payment successful:', response);
          if (response.status === 'success') {
            localStorage.setItem('paymentStatus', 'true');
            this.router.navigate(['/game']);
          } else {
            this.error = response.message || 'Payment failed';
          }
        },
        error: (error) => {
          console.error('Payment error:', error);
          if (error.status === 401) {
            this.error = 'Please log in again';
            this.router.navigate(['/login']);
          } else {
            this.error = error.error?.message || 'Payment failed. Please try again.';
          }
        },
        complete: () => {
          this.processing = false;
        }
      });
    } else {
      this.error = 'Please fill out all fields correctly';
    }
  }

  // Helper method for template
  getErrorMessage(fieldName: string): string {
    const control = this.paymentForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'cardNumber':
            return 'Please enter a valid 16-digit card number';
          case 'expirationDate':
            return 'Please enter a valid date (MM/YY)';
          case 'cvv':
            return 'Please enter a valid 3-digit CVV';
          default:
            return 'Invalid format';
        }
      }
    }
    return '';
  }
}