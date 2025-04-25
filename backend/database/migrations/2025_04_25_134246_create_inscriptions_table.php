<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('inscriptions', function (Blueprint $table) {
        $table->id();
        $table->timestamp('dateInscription')->nullable();
        $table->float('prix')->default(0);
        $table->float('progression')->default(0);
        $table->foreignId('cours_id')->constrained()->onDelete('cascade');
        $table->foreignId('etudiant_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
