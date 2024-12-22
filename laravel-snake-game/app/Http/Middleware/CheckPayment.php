<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPayment
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->has_paid) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment required to access this feature',
                'code' => 'PAYMENT_REQUIRED'
            ], 402);
        }

        return $next($request);
    }
}