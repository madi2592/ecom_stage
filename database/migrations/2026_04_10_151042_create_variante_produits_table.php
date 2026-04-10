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
    Schema::create('variante_produits', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
        $table->string('taille', 20); // S, M, L ou 42, 43...
        $table->string('couleur', 50); // Noir, Bleu...
        $table->integer('stock')->default(0);
        $table->string('image_url')->nullable(); // Si une couleur spécifique a une photo dédiée
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variante_produits');
    }
};
