<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Add this import

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'cardNumber' => 'required|string',
            'expirationDate' => 'required|string',
            'cvv' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        try {
            // Log the request data for debugging
            Log::info('Payment request data:', $request->all());

            // Create payment record
            Payment::create([
                'user_id' => $user->id,
                'amount' => $request->amount,
                'status' => 'completed',
                'payment_method' => 'card',
                'card_last_four' => substr($request->cardNumber, -4)
            ]);

            // Update user's payment status
            User::where('id', $user->id)->update(['has_paid' => true]);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment processed successfully',
                'has_paid' => true
            ]);

        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Payment processing failed'
            ], 500);
        }
    }
}