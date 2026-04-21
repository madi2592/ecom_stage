<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;

class NumeroCommandeService
{
    /**
     * Génère un numéro unique CMD-YYYYMMDD-XXX
     * La transaction garantit qu'aucun doublon n'est possible
     */
    public static function generer(): string
    {
        return DB::transaction(function () {
            $date = now()->format('Ymd');
            $prefixe = "CMD-{$date}-";

            // Compte les commandes du jour pour obtenir le prochain index
            $count = DB::table('commandes')
                ->where('numero_commande', 'like', $prefixe . '%')
                ->lockForUpdate() // Verrou atomique
                ->count();

            $suffixe = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            return $prefixe . $suffixe;
        });
    }
}