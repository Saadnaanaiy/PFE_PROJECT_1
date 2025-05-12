<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\InstructorCourseController;
use App\Http\Controllers\InstructorLessonController;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdministrateurController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post("/register", [UserController::class, "register"]);
Route::post("/login", [UserController::class, "login"])->name("login");

// Public course routes
Route::get('/courses', [CoursController::class, 'index']);
Route::get('/courses/search/{query}', [CoursController::class, 'search']);
Route::get('/courses/{id}', [CoursController::class, 'show']);
Route::match(['put','patch'], 'courses/{course}', [CoursController::class, 'updateProgress']);
Route::get('/categories', [CoursController::class, 'getCategories']);
Route::get('/courses/{id}/forums', [CoursController::class, 'getForums']);
// Public : toutes les catégories
Route::get('/categories', [CategorieController::class, 'index']);
// Public : détail d'une catégorie
Route::get('/categories/{id}', [CategorieController::class, 'show']);
// Public : cours d'une catégorie
Route::get('/categories/{id}/courses', [CoursController::class, 'getByCategory']);

// Enable the Stripe webhook endpoint
Route::post('/stripe/webhook', [PaymentController::class, 'handleWebhook']);

// Payment success and cancel routes need to be accessible without auth
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
Route::get("/instructors", [UserController::class, "getInstructors"]);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get("/user", [UserController::class, "profile"]);
    Route::match(['put','patch'], 'courses/{course}', [CoursController::class, 'updateProgress']);
    Route::get("/users", [UserController::class, "index"]);
    Route::put("/profile/update", [UserController::class, "updateProfile"]);
    Route::delete("/profile/delete", [UserController::class, "delete"]);
    Route::get("/instructors", [UserController::class, "getInstructors"]);
    Route::get("/instructors/{user}", [UserController::class, "show"]);
    Route::post("/logout", [UserController::class, "logout"]);


    // Forum route
    Route::post('/courses/{id}/forums', [CoursController::class, 'createForum']);
    Route::post('/forums/{forumId}/discussions', [CoursController::class, 'addDiscussion']);
    Route::get('/courses/{courseId}/forums/{forumId}/discussions/{discussionId}', [CoursController::class, 'showDiscussion']);

    // Cart routes
    Route::get('/cart', [PanierController::class, 'index']);
    Route::post('/cart/add', [PanierController::class, 'addToCart']);
    Route::delete('/cart/{coursId}', [PanierController::class, 'removeFromCart']);
    Route::delete('/cart', [PanierController::class, 'clearCart']);
    Route::get('/cart/check/{coursId}', [PanierController::class, 'checkInCart']);

    Route::get('/discussions/{discussionId}/messages', [MessageController::class, 'index']);
    Route::post('/discussions/{discussionId}/messages', [MessageController::class, 'store']);
    Route::post('/discussions/{discussionId}/typing', [MessageController::class, 'typing']);

    Route::post('/checkout', [PaymentController::class, 'createCheckoutSession']);

    // Payment history
    Route::get('/payment/history', [PaymentController::class, 'getPaymentHistory']);

    Route::get('/enrolled-courses', [TransactionController::class, 'getEnrolledCourses']);
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
    Route::get('/categories/{id}', [InstructorCourseController::class, 'showCategorie']);
    Route::post('/categories', [InstructorCourseController::class, 'storeCategorie']);
    Route::put('/categories/{id}', [InstructorCourseController::class, 'updateCategorie']);
    Route::delete('/categories/{id}', [InstructorCourseController::class, 'destroyCategorie']);

    // Section routes
    Route::get('/courses/{courseId}/sections', [InstructorCourseController::class, 'getSections']);
    Route::post('/courses/{courseId}/sections', [InstructorCourseController::class, 'storeSection']);
    Route::put('/courses/{courseId}/sections/{sectionId}', [InstructorCourseController::class, 'updateSection']);
    Route::delete('/courses/{courseId}/sections/{sectionId}', [InstructorCourseController::class, 'destroySection']);
    Route::put('/courses/{courseId}/sections/reorder', [InstructorCourseController::class, 'reorderSections']);

    // Lesson routes
    Route::get('/sections/{sectionId}/lessons', [InstructorCourseController::class, 'getLessons']);
    Route::post('/sections/{sectionId}/lessons', [InstructorCourseController::class, 'storeLecon']);
    Route::put('/sections/{sectionId}/lessons/{lessonId}', [InstructorCourseController::class, 'updateLecon']);
    Route::delete('/sections/{sectionId}/lessons/{lessonId}', [InstructorCourseController::class, 'destroyLecon']);
    Route::post('/lessons/{lessonId}/video', [InstructorCourseController::class, 'storeVideo']);

    // Video upload routes
    Route::post('/lessons/{lessonId}/video/init', [InstructorCourseController::class, 'initVideoUpload']);
    Route::post('/lessons/{lessonId}/video/chunk', [InstructorCourseController::class, 'uploadVideoChunk']);
    Route::post('/lessons/{lessonId}/video/complete', [InstructorCourseController::class, 'completeVideoUpload']);
});

// Admin-specific routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Dashboard statistics
    Route::get("/dashboard", [AdminController::class, 'getStudents']);
    Route::get('/profile', [AdminController::class, 'showProfile']);

    Route::put('/courses/{id}/update', [AdminController::class, 'updateCourse']);
    Route::delete('/courses/{id}', [AdminController::class, 'deleteCourse']);

    Route::put("/instructors/{id}/update", [AdminController::class, 'updateInstructor']);
    Route::delete("/instructors/{id}/delete", [AdminController::class, 'deleteInstructor']);
});

