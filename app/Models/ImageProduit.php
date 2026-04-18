<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ImageProduit extends Model
{
    // Indique explicitement la table si elle ne suit pas la convention plurielle automatique
    protected $table = 'image_produits';

    protected $fillable = [
        'produit_id',
        'chemin',
        'est_principale',
        'ordre'
    ];

    // Force le type booléen pour éviter les erreurs de comparaison en JS/React
    protected $casts = [
        'est_principale' => 'boolean',
        'ordre' => 'integer',
    ];

    /**
     * Nettoyage automatique du fichier physique lors de la suppression
     */
    protected static function booted()
    {
        static::deleting(function ($image) {
            // Utilisation d'une vérification plus robuste du chemin
            if (!empty($image->chemin)) {
                Storage::disk('public')->delete($image->chemin);
            }
        });
    }

    /**
     * Relation inverse
     */
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}