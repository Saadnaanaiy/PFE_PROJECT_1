<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\InstructorCourseController;
use App\Http\Controllers\InstructorLessonController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdministrateurController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post("/register", [UserController::class, "register"]);
Route::post("/login", [UserController::class, "login"]);

// Public course routes
Route::get('/courses', [CoursController::class, 'index']);
Route::get('/courses/{id}', [CoursController::class, 'show']);
Route::get('/categories', [CoursController::class, 'getCategories']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get("/user", [UserController::class, "profile"]);
    Route::get("/users", [UserController::class, "index"]);
    Route::put("/profile/update", [UserController::class, "updateProfile"]);
    Route::delete("/profile/delete", [UserController::class, "delete"]);
    Route::get("/instructors", [UserController::class, "getInstructors"]);
    Route::get("/instructors/{user}", [UserController::class, "show"]);
    Route::get("/logout", [UserController::class, "logout"]);

    // Cart routes (commented out for now)
    // Route::post('/courses/{id}/add-to-cart', [CoursController::class, 'addToCart']);
    // Route::get('/cart', [CoursController::class, 'getCart']);
    // Route::delete('/cart/{id}', [CoursController::class, 'removeFromCart']);
});

// Instructor-specific routes
Route::middleware('auth:sanctum')->prefix('instructor')->group(function () {
    // Course routes
    Route::get('/courses', [InstructorCourseController::class, 'index']);
    Route::post('/courses', [InstructorCourseController::class, 'store']);
    Route::get('/courses/{id}', [InstructorCourseController::class, 'show']);
    Route::put('/courses/{id}', [InstructorCourseController::class, 'update']);
    Route::delete('/courses/{id}', [InstructorCourseController::class, 'destroy']);

    // Category routes
    Route::get('/categories', [InstructorCourseController::class, 'getCategories']);
    Route::post('/categories', [InstructorCourseController::class, 'storeCategorie']);
    Route::put('/categories/{id}', [InstructorCourseController::class, 'updateCategorie']);
    Route::delete('/categories/{id}', [InstructorCourseController::class, 'destroyCategorie']);

    // Section routes
    Route::get('/courses/{courseId}/sections', [InstructorCourseController::class, 'getSections']);
    Route::post('/courses/{courseId}/sections', [InstructorCourseController::class, 'storeSection']);
    Route::put('/courses/{courseId}/sections/{sectionId}', [InstructorCourseController::class, 'updateSection']);
    Route::delete('/courses/{courseId}/sections/{sectionId}', [InstructorCourseController::class, 'destroySection']);
    Route::put('/courses/{courseId}/sections/reorder', [InstructorCourseController::class, 'reorderSections']);


    // Lesson routes (commented out for now)
    Route::post('/courses/{courseId}/sections/{sectionId}/lessons', [InstructorCourseController::class, 'storeLecon']);

});

// Lesson routes (commented out for now)
// Route::middleware(['auth:sanctum'])->prefix('api/instructor/courses/{courseId}/sections/{sectionId}')->group(function () {
//     Route::get('/lessons', [InstructorLessonController::class, 'getLessons']);
//     Route::post('/lessons', [InstructorLessonController::class, 'storeLesson']);
//     Route::put('/lessons/{lessonId}', [InstructorLessonController::class, 'updateLesson']);
//     Route::delete('/lessons/{lessonId}', [InstructorLessonController::class, 'destroyLesson']);
//     Route::post('/lessons/reorder', [InstructorLessonController::class, 'reorderLessons']);
// });

// Admin-specific routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Dashboard statistics
    Route::get("/dashboard", [AdminController::class, 'getStudents']);

    // Route::get('/dashboard', [AdministrateurController::class, 'getDashboardStats']);

    // // User management
    // Route::get('/users', [AdministrateurController::class, 'getAllUsers']);
    // Route::get('/users/role/{role}', [AdministrateurController::class, 'getUsersByRole']);
    // Route::get('/users/{id}', [AdministrateurController::class, 'getUser']);
    // Route::post('/users', [AdministrateurController::class, 'createUser']);
    // Route::put('/users/{id}', [AdministrateurController::class, 'updateUser']);
    // Route::delete('/users/{id}', [AdministrateurController::class, 'deleteUser']);

    // // Course management
    // Route::get('/courses', [AdministrateurController::class, 'getAllCourses']);
    // Route::get('/courses/{id}', [AdministrateurController::class, 'getCourse']);
    Route::put('/courses/{id}/update', [AdminController::class, 'updateCourse']);
    Route::delete('/courses/{id}', [AdminController::class, 'deleteCourse']);

    Route::put("/instructors/{id}/update", [AdminController::class, 'updateInstructor']);
    Route::delete("/instructors/{id}/delete", [AdminController::class, 'deleteInstructor']);

    // // Category management
    // Route::get('/categories', [AdministrateurController::class, 'getAllCategories']);
    // Route::get('/categories/{id}', [AdministrateurController::class, 'getCategory']);
    // Route::post('/categories', [AdministrateurController::class, 'createCategory']);
    // Route::put('/categories/{id}', [AdministrateurController::class, 'updateCategory']);
    // Route::delete('/categories/{id}', [AdministrateurController::class, 'deleteCategory']);
});
