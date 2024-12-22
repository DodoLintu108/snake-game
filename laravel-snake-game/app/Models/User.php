<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // JWT required methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Payment related methods and relationships
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getHasPaidAttribute()
    {
        return $this->payments()->where('status', 'completed')->exists();
    }

    // Optional: Add this if you want has_paid to be included in JSON responses
    protected $appends = ['has_paid'];
}