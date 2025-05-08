<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Etudiant;
use App\Models\Instructeur;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function register(Request $request)
{
    // Validation de la requête
    $request->validate([
        'nom' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'role' => 'required|string|in:etudiant,instructeur,administrateur',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10048',
        'bio' => 'required_if:role,instructeur|string|max:500',
        'specialite' => 'required_if:role,instructeur|string|max:255',
    ]);

    // Démarrer une transaction de base de données
    DB::beginTransaction();

    try {
        $imagePath = null;
        if ($request->hasFile('image')) {
            // Store the image in a more organized way
            // Use a role-specific subfolder for better organization
            $folder = $request->role . 's'; // Creates 'etudiants', 'instructeurs', etc.
            $imagePath = $request->file('image')->store($folder, 'public');
        }

        // Créer l'utilisateur
        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            // Don't store the image path in the users table if you're also storing it in role-specific tables
            // This prevents duplication and inconsistency
            // 'image' => $imagePath,
        ]);

        // En fonction du rôle, créer l'enregistrement correspondant
        if ($request->role === 'etudiant') {
            // Créer l'enregistrement étudiant
            Etudiant::create([
                'user_id' => $user->id,
                'image' => $imagePath,
                // Ajouter d'autres champs spécifiques aux étudiants si nécessaire
            ]);
        } else if ($request->role === 'instructeur') {
            // Créer l'enregistrement instructeur
            Instructeur::create([
                'user_id' => $user->id,
                'bio' => $request->bio,
                'specialite' => $request->specialite,
                'image' => $imagePath,
            ]);
        }

        // Valider la transaction
        DB::commit();

        // Transform user data for response to include full image URL
        $responseUser = $user->toArray();

        // Add role-specific data to response
        if ($request->role === 'etudiant') {
            $etudiant = Etudiant::where('user_id', $user->id)->first();
            $responseUser['etudiant'] = $etudiant;
            if ($etudiant && $etudiant->image) {
                $responseUser['etudiant']['image'] = asset('storage/' . $etudiant->image);
            }
        } else if ($request->role === 'instructeur') {
            $instructeur = Instructeur::where('user_id', $user->id)->first();
            $responseUser['instructeur'] = $instructeur;
            if ($instructeur && $instructeur->image) {
                $responseUser['instructeur']['image'] = asset('storage/' . $instructeur->image);
            }
        }

        return response()->json([
            'message' => 'Utilisateur enregistré avec succès',
            'user' => $responseUser
        ], 201);
    } catch (\Exception $e) {
        // Annuler la transaction en cas d'échec
        DB::rollBack();

        return response()->json([
            'message' => 'Échec de l\'enregistrement',
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
                'message' => 'Identifiants de connexion invalides'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function profile()
{
    $user = auth()->user();
    $userData = $user->toArray();

    // Always put image in user.image property to match frontend expectations
    if ($user->isEtudiant()) {
        $etudiant = $user->etudiant;
        if ($etudiant && $etudiant->image) {
            $userData['image'] = asset($etudiant->image);
        }
    } elseif ($user->isInstructeur()) {
        $instructeur = $user->instructeur;
        if ($instructeur && $instructeur->image) {
            $userData['image'] = asset($instructeur->image);
        }
    } elseif ($user->isAdmin()) {
        $administrateur = $user->administrateur;
        if ($administrateur && $administrateur->image) {
            $userData['image'] = asset($administrateur->image);
        }
    }

    return response()->json($userData);
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
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Obtenir une liste de tous les utilisateurs.
     * Potentiellement restreindre cela aux administrateurs à l'avenir.
     */
    public function index()
    {
        // Optionnel: Ajouter une vérification d'autorisation (ex., uniquement pour les administrateurs)
        // if (!Gate::allows('view-users')) {
        //     return response()->json(['message' => 'Interdit'], 403);
        // }

        $users = User::where('role', 'instructeur')
                    ->with('instructeur')
                    ->get();

        return response()->json(['instructeurs' => $users]);
    }

    /**
     * Obtenir une liste des utilisateurs avec le rôle 'instructeur'.
     */
    /**
 * Obtenir une liste des utilisateurs avec le rôle 'instructeur'.
 */

 public function getInstructorCourses($user) {
    // Verify the user exists and is an instructor
    $instructor = User::where('id', $user)
        ->whereHas('instructeur')
        ->first();

    if (!$instructor) {
        return response()->json(['message' => 'Instructor not found'], 404);
    }

    // Get all courses by this instructor
    $courses = Cours::where('instructor_id', $user)
        ->with(['categorie', 'reviews', 'sections'])
        ->withCount(['students as students_count', 'sections as sections_count'])
        ->get();

    return response()->json([
        'courses' => $courses
    ], 200);
}
public function getInstructors() {
    // Get instructors with related data
    $instructeurs = User::where('role', 'instructeur')
        ->with(['instructeur' => function($query) {
            $query->select('id', 'user_id', 'bio', 'specialite', 'image');
            // Include courses created by the instructor
            $query->with(['cours' => function($coursQuery) {
                $coursQuery->select('id', 'titre', 'description', 'prix', 'niveau',
                                   'image', 'instructeur_id', 'categorie_id');
                // Count students enrolled in each course
                $coursQuery->withCount('etudiants');
            }]);
            // Count courses created by the instructor
            $query->withCount('cours');
        }])
        ->get();

    // Get total enrollment counts for each instructor
    foreach ($instructeurs as $instructeur) {
        if ($instructeur->instructeur) {
            // Get instructor ID
            $instructeurId = $instructeur->instructeur->id;

            // Count total enrollment records for this instructor's courses
            $totalEnrollments = DB::table('etudiant_cours')
                ->join('cours', 'etudiant_cours.cours_id', '=', 'cours.id')
                ->where('cours.instructeur_id', $instructeurId)
                ->count();

            // Set the students_count property to the total enrollments
            // This counts each student-course combination (not deduplicating students)
            $instructeur->instructeur->students_count = $totalEnrollments;

            // For debugging/comparison: Also get the unique student count
            $uniqueStudentsCount = DB::table('etudiant_cours')
                ->join('cours', 'etudiant_cours.cours_id', '=', 'cours.id')
                ->where('cours.instructeur_id', $instructeurId)
                ->select('etudiant_cours.etudiant_id')
                ->distinct()
                ->count();

            $instructeur->instructeur->unique_students_count = $uniqueStudentsCount;
        } else {
            $instructeur->instructeur->students_count = 0;
            $instructeur->instructeur->unique_students_count = 0;
        }
    }

    // Transform the instructeurs collection
    $instructeurs->transform(function ($instructeur) {
        // Transform the image URL if exists
        if (isset($instructeur->instructeur->image)) {
            $instructeur->instructeur->image = asset('storage/' . $instructeur->instructeur->image);
        } else {
            // Provide a default image URL
            $instructeur->instructeur->image = asset('img/default-instructor.jpg');
        }

        return $instructeur;
    });

    return response()->json(['instructors' => $instructeurs]);
}

    /**
     * Obtenir les détails d'un utilisateur spécifique.
     * Potentiellement restreindre l'accès en fonction des rôles.
     */
public function show($id)
{
    $user = User::where('id', $id)
        ->with([
            'instructeur' => function ($query) {
                $query->select('id', 'user_id', 'bio', 'specialite', 'image');
            },
            'etudiant' => function ($query) {
                $query->select('id', 'user_id', 'image');
            }
        ])
        ->first();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    if ($user->role === 'instructeur') {
        // Load courses for this instructor
        $courses = Cours::where('instructeur_id', $user->instructeur->id)
            ->select('id', 'titre', 'description', 'image', 'prix', 'created_at')
            ->get();

        // Transform courses for frontend compatibility
        $transformedCourses = $courses->map(function($cours) {
            return [
                'id' => $cours->id,
                'title' => $cours->titre,  // Map French to English names for frontend
                'description' => $cours->description,
                'price' => $cours->prix,
                'image' => $cours->image ? asset('storage/' . $cours->image) : asset('img/default-course.jpg'),
                'created_at' => $cours->created_at
            ];
        });

        // Add courses to the response
        $user->instructeur->courses = $transformedCourses;  // Use "courses" instead of "cours" for frontend

        // Count courses and students
        $user->instructeur->courses_count = $courses->count();  // Use "courses_count" instead of "cours_count"
        $user->instructeur->students_count = Etudiant::whereHas('cours', function ($query) use ($courses) {
            $query->whereIn('cours.id', $courses->pluck('id'));
        })->count();

        // Transform the image URL if exists
        if ($user->instructeur && $user->instructeur->image) {
            $user->instructeur->image = asset('storage/' . $user->instructeur->image);
        } else {
            // Provide a default image URL
            $user->instructeur->image = asset('img/default-instructor.jpg');
        }
    } else if ($user->role === 'etudiant') {
        // Transform the image URL for student if exists
        if ($user->etudiant && $user->etudiant->image) {
            $user->etudiant->image = asset('storage/' . $user->etudiant->image);
        } else {
            // Provide a default image URL for student
            $user->etudiant->image = asset('img/default-student.jpg');
        }
    }

    return response()->json($user);
}

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . auth()->id(),
            'password' => 'string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth()->user();

        if ($request->has('nom')) {
            $user->nom = $request->nom;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    public function delete()
    {
        $user = auth()->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}
