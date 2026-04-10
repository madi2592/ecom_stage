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
    Schema::create('coupons', function (Blueprint $table) {
        $table->id();
        $table->string('code', 50)->unique();
        $table->enum('type', ['pourcentage', 'fixe']);
        $table->decimal('valeur', 10, 2);
        $table->decimal('montant_minimal', 10, 2)->default(0);
        $table->date('date_expiration')->nullable();
        $table->integer('limite_utilisation')->nullable();
        $table->integer('utilisations_actuelles')->default(0);
        $table->boolean('est_actif')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
