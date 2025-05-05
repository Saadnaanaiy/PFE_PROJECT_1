<?php

namespace App\Http\Controllers;

use App\Models\Panier;
use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    /**
     * Get the current active cart (panier) with its courses.
     * If none exists, create one.
     * Here: we map each course's image filename to a full URL via asset().
     */
    public function index()
    {
        $user = Auth::user();

        $panier = Panier::firstOrCreate(
            ['user_id' => $user->id, 'is_active' => true],
            ['is_active' => true]
        );

        // eager-load courses with instructors, their user details, and categories
        $panier->load('cours.instructeur.user', 'cours.categorie');

        // transform each Cours model so the 'image' field holds a full URL
        $coursAvecImages = $panier->cours->map(function ($cours) {
            // Set course image URL if it's not already a full URL
            if (!str_starts_with($cours->image, 'http://') && !str_starts_with($cours->image, 'https://')) {
                $cours->image = asset('storage/' . $cours->image);
            }

            // Set instructor image URL if it exists
            if ($cours->instructeur && $cours->instructeur->image) {
                // Check if the image URL already starts with http:// or https://
                if (!str_starts_with($cours->instructeur->image, 'http://') && !str_starts_with($cours->instructeur->image, 'https://')) {
                    $cours->instructeur->image = asset('storage/' . $cours->instructeur->image);
                }
            }

            return $cours;
        });

        // replace the relation on the Panier instance
        $panier->setRelation('cours', $coursAvecImages);

        return response()->json($panier);
    }

    /**
     * Add a course to the cart, with its current price.
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'cours_id' => 'required|exists:cours,id',
        ]);

        $user   = Auth::user();
        $cours  = Cours::findOrFail($request->cours_id);

        $panier = Panier::firstOrCreate(
            ['user_id' => $user->id, 'is_active' => true],
            ['is_active' => true]
        );

        if ($panier->cours()->where('cours_id', $cours->id)->exists()) {
            return response()->json(['message' => 'Course already in cart'], 409);
        }

        $panier->cours()->attach($cours->id, [
            'prix' => $cours->prix,
        ]);

        return response()->json(['message' => 'Added to cart'], 201);
    }

    /**
     * Remove a single course from the cart
     */
    public function removeFromCart($coursId)
    {
        $user   = Auth::user();
        $panier = Panier::where('user_id', $user->id)
                        ->where('is_active', true)
                        ->firstOrFail();

        $panier->cours()->detach($coursId);

        return response()->json(['message' => 'Removed from cart']);
    }

    /**
     * Clear all courses from the cart
     */
    public function clearCart()
    {
        $user   = Auth::user();
        $panier = Panier::where('user_id', $user->id)
                        ->where('is_active', true)
                        ->firstOrFail();

        $panier->cours()->detach();

        return response()->json(['message' => 'Cart cleared']);
    }

    /**
     * Check if a given course is in the cart
     */
    public function checkInCart($coursId)
    {
        $user   = Auth::user();
        $panier = Panier::where('user_id', $user->id)
                        ->where('is_active', true)
                        ->first();

        $inCart = $panier
            ? (bool) $panier->cours()->where('cours_id', $coursId)->count()
            : false;

        return response()->json(['in_cart' => $inCart]);
    }
}
