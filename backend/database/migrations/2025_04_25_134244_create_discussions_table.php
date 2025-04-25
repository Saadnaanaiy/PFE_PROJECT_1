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
    Schema::create('discussions', function (Blueprint $table) {
        $table->id();
        $table->string('sujet');
        $table->timestamp('dateCreation')->nullable();
        $table->foreignId('forum_id')->constrained()->onDelete('cascade');
        $table->foreignId('etudiant_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discussions');
    }
};
