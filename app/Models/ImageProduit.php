<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImageProduit extends Model
{
    protected $fillable = ['produit_id', 'chemin', 'est_principale', 'ordre'];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}