<?php
// database/migrations/xxxx_xx_xx_create_cours_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->float('prix')->default(0);
            $table->string('niveau');
            $table->string('image')->nullable();
            $table->timestamp('dateCreation')->useCurrent();
            $table->integer('dureeMinutes')->default(0);
            $table->integer('progress')->default(0); // Added progress field
            $table->foreignId('instructeur_id')->constrained()->onDelete('cascade');
            $table->foreignId('categorie_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cours');
    }
};