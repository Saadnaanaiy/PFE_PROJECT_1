<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Cours;
use App\Models\Discussion;
use App\Models\Etudiant;
use App\Models\Forum;
use App\Models\Instructeur;
use App\Models\Message;
use App\Models\Section;
use App\Models\Lecon;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function getStudents()
    {
        $students = Etudiant::with("user")->get()->map(function ($student) {
            if ($student->image) {
                // assuming $student->image holds e.g. "etudiants/filename.jpg"
                $student->image = asset("storage/{$student->image}");
                // → "http://your-app.test/storage/etudiants/filename.jpg"
            }
            return $student;
        });


        $instructors = Instructeur::with("user")->get()->map(function ($instructor) {
            if ($instructor->image) {
                // assuming $student->image holds e.g. "etudiants/filename.jpg"
                $instructor->image = asset("storage/{$instructor->image}");
                // → "http://your-app.test/storage/etudiants/filename.jpg"
            }
            return $instructor;
        });
        $courses = Cours::with("categorie")->get()->map(function ($course) {
            if ($course->image) {
                $course->image = asset("storage/{$course->image}");
            }
            return $course;
        });

        if ($students->isEmpty()) {
            return response()->json(['message' => 'No students found'], 404);
        }

        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'No instructors found'], 404);
        }

        $categories = Categorie::all();

        // Get sections, lessons, and videos
        $sections = Section::all();
        $lecons = Lecon::all();
        $videos = Video::all();
        $forums = Forum::all();
        $discussions = Discussion::all();
        $messages = Message::all();

        return response()->json([
            $students,
            $instructors,
            $courses,
            $categories,
            $sections,
            $lecons,
            $videos,
            $forums,
            $discussions,
            $messages
        ], 200);
    }

    public function deleteCourse(string $id)
    {
        $course = Cours::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully'], 200);
    }

    public function updateCourse(Request $request, string $id)
    {
        $course = Cours::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'categorie_id' => 'sometimes|exists:categories,id',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'niveau'=> 'sometimes|string',
            'prix' => 'sometimes|numeric',
            'dureeMinutes' => 'sometimes|integer',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses', 'public');
            $validatedData['image'] = $imagePath;
        }

        $course->update($validatedData);

        return response()->json(['message' => 'Course updated successfully', 'course' => $course], 200);
    }

    public function updateInstructor(Request $request, string $id)
    {
        $instructor = Instructeur::find($id);

        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }

        $validatedData = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $instructor->user_id,
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'sometimes|string',
            'specialite' => 'sometimes|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('instructeurs', 'public');
            $validatedData['image'] = $imagePath;
        }

        $instructor->update($validatedData);

        return response()->json(['message' => 'Instructor updated successfully', 'instructor' => $instructor], 200);
    }

    public function deleteInstructor(string $id)
    {
        $instructor = Instructeur::find($id);

        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }

        $instructor->delete();

        return response()->json(['message' => 'Instructor deleted successfully'], 200);
    }

    public function showProfile(Request $request)
{
    $user = Auth::user();

    if (! $user || $user->role !== 'administrateur') {
        return response()->json(['error'=>'Unauthorized'], 403);
    }

    $admin = $user->administrateur;
    if (! $admin) {
        return response()->json(['error'=>'Admin profile not found.'], 404);
    }

    // Build the full public URL
    $imageUrl = asset('storage/' . $admin->image);

    return response()->json([
        'admin' => [
            'bio'       => $admin->bio ?? null,
            'specialite'=> $admin->specialite ?? null,
            'image_url' => $imageUrl,
        ],
    ]);
}

}
