<?php
// app/Http/Controllers/API/ScoreController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function topScores()
    {
        return Score::orderBy('score', 'desc')->take(3)->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string',
            'username' => 'required|string',
            'score' => 'required|integer'
        ]);

        return Score::create($validatedData);
    }
}