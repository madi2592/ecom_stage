<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commande extends Model
{
    protected $fillable = [
        'numero_commande', 'nom_complet', 'telephone', 'ville', 
        'adresse_livraison', 'google_maps_url', 'email', 
        'total_ht', 'remise', 'total_ttc', 'coupon_id', 'statut'
    ];

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}