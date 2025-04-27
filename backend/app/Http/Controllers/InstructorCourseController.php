<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InstructorCourseController extends Controller
{
    // List instructor's courses
    public function index()
    {
        $user = Auth::user();
        $instructeur = $user->instructeur;

        if (!$instructeur) {
            return response()->json([
                'message' => 'You are not registered as an instructor'
            ], 403);
        }

        $cours = $instructeur->cours()->with('categorie')->get();

        $cours->transform(function ($course) {
            if ($course->image) {
                $course->image = asset('storage/' . $course->image);
            }
            return $course;
        });
        
        return response()->json([
            'courses' => $cours
        ]);
    }

    // Create a new course
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'niveau' => 'required|string|in:Débutant,Intermédiaire,Avancé',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dureeMinutes' => 'required|integer|min:0',
            'categorie_id' => 'required|exists:categories,id',
        ]);

        $instructeur = Auth::user()->instructeur;

        if (!$instructeur) {
            return response()->json([
                'message' => 'You are not registered as an instructor'
            ], 403);
        }

        $data = $request->all();
        $data['instructeur_id'] = $instructeur->id;
        $data['progress'] = 0;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cours', 'public');
            $data['image'] = $path;
        }

        $cours = Cours::create($data);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $cours
        ], 201);
    }

    // Show a specific course
    public function show($id)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->with('categorie')
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        return response()->json([
            'course' => $cours
        ]);
    }

    // Update a course
    public function update(Request $request, $id)
    {
        $request->validate([
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'prix' => 'sometimes|required|numeric|min:0',
            'niveau' => 'sometimes|required|string|in:Débutant,Intermédiaire,Avancé',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dureeMinutes' => 'sometimes|required|integer|min:0',
            'progress' => 'sometimes|required|integer|min:0|max:100',
            'categorie_id' => 'sometimes|required|exists:categories,id',
        ]);

        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            if ($cours->image) {
                Storage::disk('public')->delete($cours->image);
            }

            $path = $request->file('image')->store('cours', 'public');
            $data['image'] = $path;
        }

        $cours->update($data);

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $cours
        ]);
    }

    // Delete a course
    public function destroy($id)
    {
        $instructeur = Auth::user()->instructeur;

        $cours = Cours::where('id', $id)
            ->where('instructeur_id', $instructeur->id)
            ->first();

        if (!$cours) {
            return response()->json([
                'message' => 'Course not found or you do not have permission'
            ], 404);
        }

        if ($cours->image) {
            Storage::disk('public')->delete($cours->image);
        }

        $cours->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    // Get all categories
    public function getCategories()
    {
        $categories = Categorie::all();

        return response()->json([
            'categories' => $categories
        ]);
    }

    public function storeCategorie(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom',
            'description' => 'nullable|string|max:1000',
        ]);

        $categorie = Categorie::create($validated);

        return response()->json([
            'message' => 'Category created successfully.',
            'categorie' => $categorie,
        ], 201);
    }
}
