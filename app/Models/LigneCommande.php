<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneCommande extends Model
{
    protected $fillable = ['commande_id', 'variante_id', 'quantite', 'prix_unitaire'];

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class);
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(VarianteProduit::class);
    }
}