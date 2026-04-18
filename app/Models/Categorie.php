<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Categorie extends Model
{
    protected $fillable = ['nom', 'slug', 'parent_id', 'description'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($categorie) {
            if (empty($categorie->slug)) {
                $categorie->slug = Str::slug($categorie->nom);
            }
        });
    }

    /**
     * RELATION MANQUANTE : Une catégorie possède plusieurs produits
     * C'est cette méthode que le ShopController appelle via withCount('produits')
     */
    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class);
    }

    /**
     * RELATION : Une catégorie peut avoir plusieurs lignes de guide de tailles
     */
    public function guides(): HasMany
    {
        return $this->hasMany(GuideTaille::class);
    }

    // Relation pour les sous-catégories
    public function sousCategories(): HasMany
    {
        return $this->hasMany(Categorie::class, 'parent_id');
    }

    // Relation pour la catégorie parente
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'parent_id');
    }
}