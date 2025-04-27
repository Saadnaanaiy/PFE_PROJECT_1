<?php

use App\Http\Controllers\InstructorCourseController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post("/register", [UserController::class, "register"]);
Route::post("/login", [UserController::class, "login"]);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get("/user", [UserController::class, "profile"]);
    Route::get("/users", [UserController::class, "index"]);
    Route::put("/profile/update", [UserController::class, "updateProfile"]);
    Route::delete("/profile/delete", [UserController::class, "delete"]);
    Route::get("/instructors", [UserController::class, "getInstructors"]);
    Route::get("/instructors/{user}", [UserController::class, "show"]);
    Route::get("/logout", [UserController::class, "logout"]);
});

// Instructor-specific routes
Route::middleware('auth:sanctum')->prefix('instructor')->group(function () {
    Route::get('/courses', [InstructorCourseController::class, 'index']);
    Route::post('/courses', [InstructorCourseController::class, 'store']);
    Route::get('/courses/{id}', [InstructorCourseController::class, 'show']);
    Route::put('/courses/{id}', [InstructorCourseController::class, 'update']);
    Route::delete('/courses/{id}', [InstructorCourseController::class, 'destroy']);
    Route::get('/categories', [InstructorCourseController::class, 'getCategories']);
    Route::post('/categories', [InstructorCourseController::class, 'storeCategorie']);
});
