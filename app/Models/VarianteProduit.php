<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VarianteProduit extends Model
{
    // On précise la table car elle est au pluriel mais complexe
    protected $table = 'variante_produits';

    protected $fillable = [
        'produit_id',
        'taille',
        'couleur',
        'stock',
        'image_url'
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class , 'produit_id');
    }
}