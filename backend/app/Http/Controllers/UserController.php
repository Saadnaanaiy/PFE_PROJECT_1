<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Instructeur;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate; // Add Gate facade

class UserController extends Controller
{
   // Assuming you're using Laravel

public function register(Request $request)
{
    // Validate the request
    $request->validate([
        'nom' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'role' => 'required|string|in:student,instructor',
    ]);

    // Start a database transaction
    DB::beginTransaction();

    try {
        // Create the user
        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Based on role, create corresponding record
        if ($request->role === 'student') {
            // Create student record
            Etudiant::create([
                'user_id' => $user->id,
                'nom' => $request->nom,
                // Add any other student-specific fields
            ]);
        } else if ($request->role === 'instructor') {
            // Create instructor record
            Instructeur::create([
                'user_id' => $user->id,
                'nom' => $request->nom,
                // Add any other instructor-specific fields
            ]);
        }

        // Commit the transaction
        DB::commit();

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    } catch (\Exception $e) {
        // Rollback the transaction in case of failure
        DB::rollBack();
        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function profile()
    {
        return response()->json(auth()->user());
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $validator = Validator::make($request->all(), [
            'nom' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        if ($request->has('nom')) {
            $user->nom = $request->nom;
        }
        
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get a list of all users.
     * Potentially restrict this to admins in the future.
     */
    public function index()
    {
        // Optional: Add authorization check (e.g., only allow admins)
        // if (!Gate::allows('view-users')) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }
        
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    /**
     * Get a list of users with the 'instructor' role.
     */
    public function getInstructors()
    {
        // Optional: Add authorization if needed
        // if (!Gate::allows('view-instructors')) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        $instructors = User::where('role', 'instructeur')->with('instructeur')->get(); // Eager load instructor details
        return response()->json(['instructors' => $instructors]);
    }

    /**
     * Get details for a specific user.
     * Potentially restrict access based on roles.
     */
    public function show(User $user) // Use route model binding
    {
        // Optional: Add authorization check
        // if (!Gate::allows('view-user', $user)) {
        //     return response()->json(['message' => 'Forbidden'], 403);
        // }

        // Load related data if needed, e.g., instructor details
        if ($user->isInstructeur()) {
            $user->load('instructeur');
        } elseif ($user->isEtudiant()) {
            $user->load('etudiant');
        }

        return response()->json($user);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . auth()->id(),
            'password' => 'string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth()->user();
        
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        return response()->json([
            'message' => 'Profile successfully updated',
            'user' => $user
        ]);
    }

    public function delete()
    {
        $user = auth()->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'User successfully deleted'
        ]);
    }
}
