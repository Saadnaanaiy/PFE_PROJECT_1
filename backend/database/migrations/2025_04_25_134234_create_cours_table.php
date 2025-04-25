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
    Schema::create('cours', function (Blueprint $table) {
        $table->id();
        $table->string('titre');
        $table->text('description')->nullable();
        $table->float('prix')->default(0);
        $table->string('niveau')->nullable();
        $table->boolean('estPublic')->default(false);
        $table->timestamp('dateCreation')->nullable();
        $table->integer('dureeMinutes')->nullable();
        $table->foreignId('categorie_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('instructeur_id')->nullable()->constrained('instructeurs')->nullOnDelete();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
