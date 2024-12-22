<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\HighScoreController;

Route::middleware('api-no-csrf')->group(function () {
    Route::post('/login', [LoginController::class, 'login'])
        ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::post('/register', [RegisterController::class, 'register'])
        ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
});

// Change from auth:sanctum to auth:api for JWT
Route::middleware('auth:api')->group(function () {
    Route::get('/check-payment-status', [PaymentController::class, 'checkStatus']);
    Route::post('/process-payment', [PaymentController::class, 'processPayment']);
    Route::post('/scores', [HighScoreController::class, 'store']);
    Route::get('/scores', [HighScoreController::class, 'getUserScores']);
    Route::get('/top-scores', [HighScoreController::class, 'getTopScores']); 
}); 