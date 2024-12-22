<?php

namespace App\Http\Controllers;

use App\Models\HighScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HighScoreController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'difficulty' => 'required|string'
        ]);

        $user = Auth::user();
        
        // Check if this is a new high score
        $existingHighScore = HighScore::where('user_id', $user->id)
            ->where('difficulty', $request->difficulty)
            ->first();

        if (!$existingHighScore || $request->score > $existingHighScore->score) {
            // Create or update high score
            HighScore::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'difficulty' => $request->difficulty
                ],
                ['score' => $request->score]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'High score updated!'
            ]);
        }

        return response()->json([
            'status' => 'info',
            'message' => 'Not a new high score'
        ]);
    }

    public function getUserScores()
    {
        $user = Auth::user();
        $scores = HighScore::where('user_id', $user->id)->get();

        return response()->json([
            'status' => 'success',
            'scores' => $scores
        ]);
    }
    public function getTopScores()
{
    $topScores = [
        'easy' => HighScore::where('difficulty', 'Easy')
            ->with('user:id,name')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get(),
        'medium' => HighScore::where('difficulty', 'Medium')
            ->with('user:id,name')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get(),
        'hard' => HighScore::where('difficulty', 'Hard')
            ->with('user:id,name')
            ->orderBy('score', 'desc')
            ->take(10)
            ->get(),
    ];

    return response()->json($topScores);
}
}