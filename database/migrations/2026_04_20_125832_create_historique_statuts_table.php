<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historique_statuts', function (Blueprint $table) {
            $table->id();

            // FK → commandes (CommandeInvite dans le diagramme)
            $table->foreignId('commande_id')
                  ->constrained('commandes')
                  ->onDelete('cascade');

            // Enum exact du diagramme de classe
            $table->enum('statut', [
                'recu',
                'approuve',
                'pret_expedition',
                'livraison_en_cours',
                'termine',
                'annule',
                'echec_livraison',
                'recycle',
            ]);

            // Libellé affiché côté client (message contextuel)
            $table->string('libelle', 200)->nullable();

            // Motif (annulation, recyclage, échec…)
            $table->text('motif')->nullable();

            // FK → users/administrateurs (nullable : le premier statut est créé par le système)
            $table->foreignId('admin_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            // Pas d'updated_at → un historique est immuable
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_statuts');
    }
};