<?php

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
    Schema::create('guide_tailles', function (Blueprint $table) {
        $table->id();
        $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
        $table->string('taille', 20); // S, M, L...
        $table->decimal('poitrine_cm', 5, 2)->nullable();
        $table->decimal('taille_cm', 5, 2)->nullable();
        $table->decimal('hanches_cm', 5, 2)->nullable();
        $table->string('pointure', 10)->nullable(); // Pour les chaussures
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_tailles');
    }
};
