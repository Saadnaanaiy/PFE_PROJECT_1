<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Panier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    /**
     * Get the current user's cart items
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        // Get or create the active cart
        $panier = $user->panier ?? Panier::create([
            'user_id' => $user->id,
            'is_active' => true
        ]);

        // Get cart with courses and their instructors
        $panier->load([
            'cours',
            'cours.instructeur.user'
        ]);

        $cartItems = $panier->cours->map(function ($cours) {
            return [
                'id' => $cours->id,
                'title' => $cours->titre,
                'instructor' => $cours->instructeur->user->nom,
                'price' => $cours->pivot->prix,
                'originalPrice' => $cours->prix,
                'quantity' => 1, // Quantity is always 1 for digital products
                'image' => $cours->image,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $cartItems
        ]);
    }

    /**
     * Add a course to the cart
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:cours,id'
        ]);

        $user = Auth::user();
        $courseId = $request->input('course_id');

        // Get or create active cart
        $panier = $user->panier ?? Panier::create([
            'user_id' => $user->id,
            'is_active' => true
        ]);

        // Check if course already in cart
        if ($panier->cours()->where('cours_id', $courseId)->exists()) {
            return response()->json([
                'success' => true,
                'message' => 'Course already in cart',
                'inCart' => true
            ]);
        }

        // Get course current price
        $cours = Cours::findOrFail($courseId);

        // Add to cart with current price
        $panier->cours()->attach($courseId, [
            'prix' => $cours->prix
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course added to cart successfully',
            'inCart' => true
        ]);
    }

    /**
     * Remove course from cart
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function removeFromCart($id)
    {
        $user = Auth::user();
        $panier = $user->panier;

        if (!$panier) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found'
            ], 404);
        }

        $panier->cours()->detach($id);

        return response()->json([
            'success' => true,
            'message' => 'Course removed from cart'
        ]);
    }

    /**
     * Clear all items from cart
     *
     * @return \Illuminate\Http\Response
     */
    public function clearCart()
    {
        $user = Auth::user();
        $panier = $user->panier;

        if (!$panier) {
            return response()->json([
                'success' => false,
                'message' => 'Cart not found'
            ], 404);
        }

        $panier->cours()->detach();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully'
        ]);
    }

    /**
     * Check if a course is in the user's cart
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function checkInCart($id)
    {
        $user = Auth::user();
        $panier = $user->panier;

        $inCart = false;

        if ($panier) {
            $inCart = $panier->cours()->where('cours_id', $id)->exists();
        }

        return response()->json([
            'success' => true,
            'inCart' => $inCart
        ]);
    }
}
