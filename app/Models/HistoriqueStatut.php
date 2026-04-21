<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueStatut extends Model
{
    // Pas d'updated_at (un jalon d'historique est immuable)
    public $timestamps = false;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'commande_id',
        'statut',
        'libelle',
        'motif',
        'admin_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // ── Labels affichés au client (messages contextuels du CDC) ──────────
    public const LABELS = [
        'recu'               => 'Commande reçue — notre équipe vous contactera sous 4h à 24h.',
        'approuve'           => 'Commande approuvée, préparation en cours.',
        'pret_expedition'    => 'Votre commande est prête, un livreur va être assigné.',
        'livraison_en_cours' => 'Votre livreur est en route, restez disponible.',
        'termine'            => 'Livré avec succès, merci pour votre achat !',
        'annule'             => 'Commande annulée.',
        'echec_livraison'    => 'Échec de livraison. Vous pouvez modifier votre adresse ou annuler.',
        'recycle'            => 'Bonne nouvelle ! Votre commande a été relancée et est prête pour la livraison.',
    ];

    // ── Méthode du diagramme : enregistrer() ─────────────────────────────
    /**
     * Crée et persiste un jalon d'historique.
     * Correspond à +enregistrer() : void du diagramme de classe.
     */
    public static function enregistrer(
        int $commandeId,
        string $statut,
        ?string $motif = null,
        ?int $adminId = null
    ): self {
        return self::create([
            'commande_id' => $commandeId,
            'statut'      => $statut,
            'libelle'     => self::LABELS[$statut] ?? null,
            'motif'       => $motif,
            'admin_id'    => $adminId,
        ]);
    }

    // ── Relations ─────────────────────────────────────────────────────────

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}