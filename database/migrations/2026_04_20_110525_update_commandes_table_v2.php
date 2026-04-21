<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            // 1. On ne touche plus aux colonnes "emplacement_supplementaire"
            // et "note_importante" car elles sont déjà là.

            // 2. On exécute uniquement la modification du statut qui avait échoué
            $table->enum('statut', [
                'Reçu',
                'Approuvée',
                'Prêt pour expédition',
                'expédiée',
                'Livrée',
                'annulée',
                'retournée',
            ])->default('Reçu')->change();
        });
    }

    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            // En cas de rollback, on remet l'ancien enum
            $table->enum('statut', ['nouveau', 'confirme', 'en_preparation', 'expedie', 'livre', 'annule', 'retourne'])
                ->default('nouveau')
                ->change();

            // Note : On ne drop pas les colonnes ici car si on fait un rollback,
            // on veut seulement annuler le changement de statut.
        });
    }
};
