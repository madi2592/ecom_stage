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
    Schema::create('ligne_commandes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
        $table->foreignId('variante_id')->constrained('variante_produits');
        $table->integer('quantite');
        $table->decimal('prix_unitaire', 10, 2); // Prix au moment de l'achat
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ligne_commandes');
    }
};
