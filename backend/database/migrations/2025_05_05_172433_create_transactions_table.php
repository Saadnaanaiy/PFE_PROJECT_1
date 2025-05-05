<?php
// Create this file using: php artisan make:migration create_transactions_table
// The file will be placed in database/migrations/yyyy_mm_dd_hhmmss_create_transactions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('panier_id')->constrained()->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_id')->nullable(); // Stripe session/payment ID
            $table->string('payment_method')->default('stripe');
            $table->string('status'); // pending, completed, failed, refunded
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
