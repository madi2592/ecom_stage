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
    Schema::create('commandes', function (Blueprint $table) {
        $table->id();
        $table->string('numero_commande')->unique(); // CMD-YYYYMMDD-XXX
        // Infos Client (Les 6 champs)
        $table->string('nom_complet');
        $table->string('telephone');
        $table->string('ville');
        $table->text('adresse_livraison');
        $table->string('google_maps_url')->nullable();
        $table->string('email')->nullable(); 

        // Totaux et Coupons
        $table->decimal('total_ht', 10, 2);
        $table->decimal('remise', 10, 2)->default(0);
        $table->decimal('total_ttc', 10, 2);
        $table->foreignId('coupon_id')->nullable()->constrained('coupons')->onDelete('set null');

        // Statuts (tes 7 statuts)
        $table->enum('statut', ['nouveau', 'confirme', 'en_preparation', 'expedie', 'livre', 'annule', 'retourne'])->default('nouveau');

        $table->text('notes_admin')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
