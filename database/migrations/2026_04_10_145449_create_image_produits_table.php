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
    Schema::create('image_produits', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
        $table->string('chemin'); // Stockera le chemin vers storage/app/public/produits/...
        $table->boolean('est_principale')->default(false); // Pour identifier l'image de couverture
        $table->integer('ordre')->default(0); // Pour trier l'affichage (avant, côté, arrière)
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_produits');
    }
};
