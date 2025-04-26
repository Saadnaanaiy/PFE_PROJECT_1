<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post("/register", [UserController::class, "register"]);
Route::post("/login", [UserController::class, "login"]);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get("/user", [UserController::class, "profile"]);
    Route::get("/users", [UserController::class, "index"]);
    Route::get("/logout", [UserController::class, "logout"]);
    Route::post("/add", [UserController::class, "add"]);
    Route::get("/profile", [UserController::class, "profile"]);
    Route::put("/profile/update", [UserController::class, "updateProfile"]);
});

// User routes (assuming some exist)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'profile']);
    Route::post('/logout', [UserController::class, 'logout']);
    
    // Add these routes:
    Route::get('/users', [UserController::class, 'index']); // Route for getting all users
    Route::get('/users/{user}', [UserController::class, 'show']); // Route for getting a specific user
    Route::get('/instructors', [UserController::class, 'getInstructors']); // Route for getting instructors
    
    // You might need routes for creating/updating instructors if not handled elsewhere
    // Route::post('/instructors', [InstructeurController::class, 'store']); // Example if using separate controller
    // Route::put('/instructors/{instructeur}', [InstructeurController::class, 'update']); // Example
});

// Public routes (assuming these exist)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
