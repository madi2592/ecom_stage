<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Produit extends Model
{
    protected $fillable = [
        'reference', 
        'libelle', 
        'categorie_id', 
        'description', 
        'composition', 
        'prix', 
        'prix_promo', 
        'est_actif'
    ];

    /**
     * RELATIONS
     */

    // Un produit appartient à une catégorie
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    // Un produit possède plusieurs images (ajouté pour ton système de galerie)
    public function images(): HasMany
    {
        return $this->hasMany(ImageProduit::class)->orderBy('ordre');
    }

    // Un produit possède une seule image principale
    public function imagePrincipale(): HasOne
    {
        return $this->hasOne(ImageProduit::class)->where('est_principale', true);
    }

    // Un produit peut avoir plusieurs variantes (Taille/Couleur)
    public function variantes(): HasMany
    {
        return $this->hasMany(VarianteProduit::class);
    }
}