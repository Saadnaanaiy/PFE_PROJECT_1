<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CoursController extends Controller
{
    /**
     * Display a listing of the courses.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Cours::with(['instructeur', 'categorie']);

        // Apply search if provided
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('titre', 'like', "%{$searchTerm}%")
                    ->orWhereHas('instructeur', function ($q) use ($searchTerm) {
                        $q->where('nom', 'like', "%{$searchTerm}%");
                    });
            });
        }

        // Apply category filter if provided
        if ($request->has('categorie') && $request->categorie) {
            $query->where('categorie_id', $request->categorie);
        }

        // Apply price filter if provided
        if ($request->has('prix')) {
            switch ($request->prix) {
                case 'free':
                    $query->where('prix', 0);
                    break;
                case 'paid':
                    $query->where('prix', '>', 0);
                    break;
                case 'under-100':
                    $query->where('prix', '<', 100);
                    break;
                case '100-200':
                    $query->whereBetween('prix', [100, 200]);
                    break;
                case 'over-200':
                    $query->where('prix', '>', 200);
                    break;
            }
        }

        // Apply rating filter if provided
        if ($request->has('rating') && $request->rating) {
            $query->where('rating', '>=', $request->rating);
        }

        // Apply sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'newest':
                    $query->orderBy('dateCreation', 'desc');
                    break;
                case 'price-low':
                    $query->orderBy('prix', 'asc');
                    break;
                case 'price-high':
                    $query->orderBy('prix', 'desc');
                    break;
                case 'rating':
                    $query->orderBy('rating', 'desc');
                    break;
                default: // 'popular'
                    $query->orderBy('etudiants_count', 'desc');
                    break;
            }
        } else {
            // Default sorting by popularity
            $query->withCount('etudiants')->orderBy('etudiants_count', 'desc');
        }

        $courses = $query->paginate(9);

        return response()->json([
            'status' => 'success',
            'data' => $courses
        ]);
    }

    /**
     * Show the form for creating a new course.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // This method is typically not used in API controllers
    }

    /**
     * Store a newly created course in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|max:255',
            'description' => 'required',
            'prix' => 'required|numeric|min:0',
            'niveau' => 'required|in:débutant,intermédiaire,avancé',
            'image' => 'nullable|image|max:2048',
            'dureeMinutes' => 'required|integer|min:1',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $course = new Cours($request->all());
        $course->instructeur_id = Auth::id();
        $course->dateCreation = now();
        $course->progress = 0;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $course->image = $path;
        }

        $course->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cours créé avec succès',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $course = Cours::with(['instructeur', 'sections.lessons', 'categorie'])
            ->withCount('etudiants')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $course
        ]);
    }

    /**
     * Show the form for editing the specified course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // This method is typically not used in API controllers
    }

    /**
     * Update the specified course in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $course = Cours::findOrFail($id);

        // Check if the authenticated user owns this course
        if ($course->instructeur_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à modifier ce cours'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|max:255',
            'description' => 'sometimes|required',
            'prix' => 'sometimes|required|numeric|min:0',
            'niveau' => 'sometimes|required|in:débutant,intermédiaire,avancé',
            'image' => 'nullable|image|max:2048',
            'dureeMinutes' => 'sometimes|required|integer|min:1',
            'categorie_id' => 'sometimes|required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $course->fill($request->except('image'));

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($course->image) {
                Storage::disk('public')->delete($course->image);
            }
            $path = $request->file('image')->store('courses', 'public');
            $course->image = $path;
        }

        $course->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cours mis à jour avec succès',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified course from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $course = Cours::findOrFail($id);

        // Check if the authenticated user owns this course
        if ($course->instructeur_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce cours'
            ], 403);
        }

        // Delete image if exists
        if ($course->image) {
            Storage::disk('public')->delete($course->image);
        }

        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Cours supprimé avec succès'
        ]);
    }

    /**
     * Get categories list
     *
     * @return \Illuminate\Http\Response
     */
    public function getCategories()
    {
        $categories = Categorie::all();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

}
