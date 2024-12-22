// src/app/interfaces/payment.interfaces.ts
export interface PaymentDetails {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
  }
  
  export interface PaymentResponse {
    status: string;
    message: string;
    has_paid: boolean;
  }