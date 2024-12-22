<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HighScore extends Model
{
    protected $fillable = [
        'user_id',
        'score',
        'difficulty'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}