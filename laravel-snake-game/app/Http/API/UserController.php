<?php
// app/Http/Controllers/API/UserController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|unique:users|max:255',
            'password' => 'required|min:6',
            'user_data' => 'sometimes|array',
            'credit_card' => 'sometimes|string'
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        return User::create($validatedData);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'username' => 'sometimes|unique:users|max:255',
            'password' => 'sometimes|min:6',
            'user_data' => 'sometimes|array',
            'credit_card' => 'sometimes|string'
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);
        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}