<?php

namespace App\Http\Controllers;

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
            'role' => 'required|string|in:etudiant,instructeur,administrateur', // Modifié pour les rôles en français
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10048',
            'bio' => 'required_if:role,instructeur|string|max:500', // Modifié pour les rôles en français
            'specialite' => 'required_if:role,instructeur|string|max:255', // Modifié pour les rôles en français
        ]);

        // Démarrer une transaction de base de données
        DB::beginTransaction();

        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
            }
            // Créer l'utilisateur
            $user = User::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'image' => $imagePath,
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

            return response()->json([
                'message' => 'Utilisateur enregistré avec succès',
                'user' => $user
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
        return response()->json(auth()->user());
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
        
        $users = User::all();
        return response()->json(['users' => $users]);
    }

    /**
     * Obtenir une liste des utilisateurs avec le rôle 'instructeur'.
     */
    public function getInstructors()
    {
        // Optionnel: Ajouter une autorisation si nécessaire
        // if (!Gate::allows('view-instructors')) {
        //     return response()->json(['message' => 'Interdit'], 403);
        // }

        $instructors = User::where('role', 'instructeur')->with('instructeur')->get(); // Chargement empressé des détails de l'instructeur
        return response()->json(['instructors' => $instructors]);
    }

    /**
     * Obtenir les détails d'un utilisateur spécifique.
     * Potentiellement restreindre l'accès en fonction des rôles.
     */
    public function show(User $user) // Utiliser la liaison de modèle de route
    {
        // Optionnel: Ajouter une vérification d'autorisation
        // if (!Gate::allows('view-user', $user)) {
        //     return response()->json(['message' => 'Interdit'], 403);
        // }

        // Charger les données associées si nécessaire, par exemple, les détails de l'instructeur
        if ($user->isInstructeur()) {
            $user->load('instructeur');
        } elseif ($user->isEtudiant()) {
            $user->load('etudiant');
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