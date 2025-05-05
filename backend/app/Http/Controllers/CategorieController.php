<?php



namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function index() {
        // Get categories with related courses
        $categories = Categorie::with('cours')->
        withCount('cours')->get();

        // Manually add the full URL for category images and course images
        $categories->map(function ($categorie) {
            // Add the full image URL for the category
            $categorie->image = $categorie->image ? asset('storage/' . $categorie->image) : null;

            // Loop through related courses and add image URLs
            $categorie->cours->map(function ($cours) {
                $cours->image = $cours->image ? asset('storage/' . $cours->image) : null;
            });

            return $categorie;
        });

        return response()->json($categories, 200);
    }

    public function show($id)
{
    // Get a specific category with related courses, and also load instructors for the courses
    $categorie = Categorie::with(['cours.instructeur'])->findOrFail($id);

    // Manually add the full URL for category images and course images
    $categorie->image_url = $categorie->image ? asset('storage/' . $categorie->image) : null;

    // Check if 'categorie_id' is present in the request to filter courses
    if (request()->has('categorie_id')) {
        // Filter the courses by 'categorie_id' if present
        $categorie->cours = $categorie->cours->where('categorie_id', request()->categorie_id);
    }

    // Loop through related courses and add image URLs, and also prepare instructor information
    $categorie->cours->map(function ($cours) {
        $cours->image = $cours->image ? asset('storage/' . $cours->image) : null;
        // Ensure instructor data is included
        if ($cours->instructeur) {
            $cours->instructeur_info = [
                'specialite' => $cours->instructeur->specialite,
                'bio' => $cours->instructeur->bio,
                'image' => $cours->instructeur->image ? asset('storage/' . $cours->instructeur->image) : null
            ];
        }
    });

    return response()->json($categorie, 200);
}

}
