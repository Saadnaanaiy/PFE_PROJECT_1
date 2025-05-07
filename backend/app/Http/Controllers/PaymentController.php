<?php
// app/Http/Controllers/PaymentController.php
namespace App\Http\Controllers;

use App\Models\Panier;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    /**
     * Create a Stripe checkout session for the user's cart
     */
    public function createCheckoutSession(Request $request)
    {
        $user = Auth::user();
        $panier = $user->panier;

        if (!$panier || $panier->cours->isEmpty()) {
            return response()->json([
                'error' => 'Votre panier est vide'
            ], 400);
        }

        // Set your Stripe API key
        Stripe::setApiKey(config('services.stripe.secret'));

        $courseItems = [];
        $totalAmount = 0;

        // Prepare course items for Stripe
        foreach ($panier->cours as $cours) {
            $courseItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $cours->titre,
                        'description' => substr($cours->description, 0, 100) . '...',
                    ],
                    'unit_amount' => $cours->pivot->prix * 100, // Amount in cents
                ],
                'quantity' => 1,
            ];

            $totalAmount += $cours->pivot->prix;
        }

        try {
            // Create a checkout session
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $courseItems,
                'mode' => 'payment',
                'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.cancel'),
                'metadata' => [
                    'user_id' => $user->id,
                    'panier_id' => $panier->id
                ]
            ]);

            return response()->json([
                'url' => $session->url
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle successful payment
     */
    public function success(Request $request)
{
    $sessionId = $request->get('session_id');

    if (!$sessionId) {
        // Frontend URL for error - ensure this matches your React route
        return redirect()->to('/checkout/result?status=error&message=Session+ID+is+missing');
    }

    Stripe::setApiKey(config('services.stripe.secret'));

    try {
        // Retrieve the session
        $session = Session::retrieve($sessionId);
        $userId = $session->metadata->user_id;
        $panierId = $session->metadata->panier_id;

        $user = User::find($userId);
        $panier = Panier::find($panierId);

        if (!$user || !$panier) {
            return redirect()->to('/checkout/result?status=error&message=Invalid+user+or+cart');
        }

        // Calculate total amount
        $totalAmount = 0;
        foreach ($panier->cours as $cours) {
            $totalAmount += $cours->pivot->prix;
        }

        // Begin transaction
        DB::beginTransaction();

        try {
            // Create transaction record
            $transaction = Transaction::create([
                'user_id' => $userId,
                'panier_id' => $panierId,
                'total_amount' => $totalAmount,
                'payment_id' => $sessionId,
                'payment_method' => 'stripe',
                'status' => 'completed',
            ]);

            // Add courses to student's courses
            $etudiant = $user->etudiant;
            if ($etudiant) {
                foreach ($panier->cours as $cours) {
                    if (!$etudiant->cours->contains($cours->id)) {
                        $etudiant->cours()->attach($cours->id);
                    }
                }
            }

            // Mark the cart as inactive
            $panier->update(['is_active' => false]);

            // Create a new empty cart for the user
            Panier::create([
                'user_id' => $userId,
                'is_active' => true
            ]);

            DB::commit();

            // Redirect to the React frontend URL, not Laravel route
            // This should match your React router path
            return redirect()->to(env('FRONTEND_URL') . '/checkout/result?status=success&transaction_id=' . $transaction->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->to(env('FRONTEND_URL') .'/checkout/result?status=error&message=' . urlencode('Failed to process payment: ' . $e->getMessage()));
        }
    } catch (ApiErrorException $e) {
        return redirect()->to('/checkout/result?status=error&message=' . urlencode($e->getMessage()));
    }
}

    /**
     * Handle cancelled payment
     */
    public function cancel()
    {
        return redirect()->to('/checkout/result?status=cancelled');
    }

    /**
     * Handle Stripe webhook
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;

                $userId = $session->metadata->user_id ?? null;
                $panierId = $session->metadata->panier_id ?? null;

                if (!$userId || !$panierId) {
                    break;
                }

                $existing = Transaction::where('payment_id', $session->id)->first();
                if ($existing) break;

                DB::beginTransaction();

                try {
                    $user = User::find($userId);
                    $panier = Panier::find($panierId);

                    if (!$user || !$panier) break;

                    // Calculate total
                    $totalAmount = 0;
                    foreach ($panier->cours as $cours) {
                        $totalAmount += $cours->pivot->prix;
                    }

                    // Create transaction
                    Transaction::create([
                        'user_id' => $userId,
                        'panier_id' => $panierId,
                        'total_amount' => $totalAmount,
                        'payment_id' => $session->id,
                        'payment_method' => 'stripe',
                        'status' => 'completed',
                    ]);

                    // Attach courses to student
                    $etudiant = $user->etudiant;
                    if ($etudiant) {
                        foreach ($panier->cours as $cours) {
                            if (!$etudiant->cours->contains($cours->id)) {
                                $etudiant->cours()->attach($cours->id);
                            }
                        }
                    }

                    // Close the old cart
                    $panier->update(['is_active' => false]);

                    // Create a new cart
                    Panier::create([
                        'user_id' => $userId,
                        'is_active' => true
                    ]);

                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Log::error('Stripe webhook failed: ' . $e->getMessage());
                }

                break;

            case 'checkout.session.expired':
                $session = $event->data->object;

                // Update transaction status if it exists
                $transaction = Transaction::where('payment_id', $session->id)->first();
                if ($transaction) {
                    $transaction->status = 'expired';
                    $transaction->save();
                }
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;

                // Find associated session and update transaction
                if (isset($paymentIntent->metadata->session_id)) {
                    $transaction = Transaction::where('payment_id', $paymentIntent->metadata->session_id)->first();
                    if ($transaction) {
                        $transaction->status = 'failed';
                        $transaction->save();
                    }
                }
                break;

            default:
                // Unexpected event type
                break;
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Get user payment history
     */
    public function getPaymentHistory()
    {
        $user = Auth::user();
        $transactions = Transaction::where('user_id', $user->id)
            ->with('panier.cours')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transactions);
    }
}
