<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Panier;
use App\Models\Cours;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Get user's enrolled courses with transaction details
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEnrolledCourses()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Get all completed transactions (non-active paniers)
        $completedPaniers = Panier::where('user_id', $user->id)
            ->where('is_active', false)
            ->with(['cours' => function($query) {
                $query->with(['categorie', 'instructeur.user']);
            }])
            ->get();
        $uniqueCours = $completedPaniers
        ->flatMap(fn($panier) => $panier->cours)
        ->unique('id')
        ->values();  // re-index

        // Format the response data
        $enrolledCourses = [];
        $totalAmount = 0;


            foreach ($uniqueCours as $cours) {
                $enrolledCourses[] = [
                    'id' => $cours->id,
                    'titre' => $cours->titre,
                    'description' => $cours->description,
                    'prix' => $cours->pivot->prix,
                    'niveau' => $cours->niveau,
                    'image' => asset("/storage/" . $cours->image), // Convert to full URL using asset()
                    'dureeMinutes' => $cours->dureeMinutes,
                    'progress'=>$cours->progress,
                    'dateCreation' => $cours->dateCreation,
                    'instructeur' => $cours->instructeur->user->nom,
                    'instructeur_image' => asset($cours->instructeur->user->image ?? 'images/default-instructor.png'), // Add instructor image with fallback
                    'categorie' => $cours->categorie->nom,
                    'categorie_id' => $cours->categorie_id,
                    'date_achat' => $cours->pivot->created_at
                ];

                $totalAmount += $cours->pivot->prix;
            }


        // Get count by category
        $categoryCounts = [];
        $categories = Categorie::all();

        foreach ($categories as $categorie) {
            $count = 0;
            foreach ($enrolledCourses as $course) {
                if ($course['categorie_id'] == $categorie->id) {
                    $count++;
                }
            }

            if ($count > 0) {
                $categoryCounts[] = [
                    'id' => $categorie->id,
                    'nom' => $categorie->nom,
                    'count' => $count
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'enrolled_courses' => $enrolledCourses,
                'total_courses' => count($enrolledCourses),
                'total_amount' => $totalAmount,
                'category_counts' => $categoryCounts
            ]
        ]);
    }

    /**
     * Get course enrollment statistics for an instructor
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInstructorEnrollmentStats()
    {
        $user = Auth::user();

        if (!$user || !$user->isInstructeur()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $instructeur = $user->instructeur;

        // Get courses created by this instructor
        $courses = Cours::where('instructeur_id', $instructeur->id)->get();
        $courseIds = $courses->pluck('id')->toArray();

        // Count enrollments from completed transactions
        $enrollmentStats = DB::table('panier_cours')
            ->join('paniers', 'panier_cours.panier_id', '=', 'paniers.id')
            ->join('cours', 'panier_cours.cours_id', '=', 'cours.id')
            ->where('paniers.is_active', false)
            ->whereIn('panier_cours.cours_id', $courseIds)
            ->select('panier_cours.cours_id', DB::raw('count(*) as enrollment_count'), DB::raw('sum(panier_cours.prix) as total_revenue'))
            ->groupBy('panier_cours.cours_id')
            ->get();

        $formattedStats = [];
        foreach ($courses as $course) {
            $stats = $enrollmentStats->where('cours_id', $course->id)->first();

            $formattedStats[] = [
                'course_id' => $course->id,
                'course_title' => $course->titre,
                'course_image' => asset($course->image), // Add course image with full URL
                'enrollment_count' => $stats ? $stats->enrollment_count : 0,
                'total_revenue' => $stats ? $stats->total_revenue : 0,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'instructor_name' => $user->nom,
                'instructor_image' => asset($user->image ?? 'images/default-instructor.png'), // Add instructor image with full URL
                'total_courses' => count($courses),
                'course_stats' => $formattedStats
            ]
        ]);
    }

    /**
     * Process checkout from active cart
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processCheckout(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Get active cart
        $panier = Panier::where('user_id', $user->id)
            ->where('is_active', true)
            ->with('cours')
            ->first();

        if (!$panier || $panier->cours->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active cart or cart is empty'
            ], 400);
        }

        // Process payment (simplified - in real app would integrate payment gateway)
        // For simplicity, we'll just mark the cart as inactive (purchased)
        $panier->is_active = false;
        $panier->save();

        // Add courses to student's enrolled courses
        if ($user->isEtudiant()) {
            $etudiant = $user->etudiant;
            foreach ($panier->cours as $cours) {
                // Check if not already enrolled
                if (!$etudiant->cours()->where('cours_id', $cours->id)->exists()) {
                    $etudiant->cours()->attach($cours->id);
                }
            }
        }

        // Create a new active cart for future purchases
        $newPanier = new Panier([
            'user_id' => $user->id,
            'is_active' => true
        ]);
        $newPanier->save();

        return response()->json([
            'success' => true,
            'message' => 'Checkout completed successfully',
            'data' => [
                'transaction_id' => $panier->id,
                'purchased_courses' => $panier->cours->count(),
                'total_amount' => $panier->cours->sum('pivot.prix')
            ]
        ]);
    }
}
