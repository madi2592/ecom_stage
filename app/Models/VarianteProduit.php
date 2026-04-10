<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VarianteProduit extends Model
{
    protected $fillable = ['produit_id', 'taille', 'couleur', 'stock', 'image_url'];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}