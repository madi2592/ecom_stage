<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Categorie extends Model
{
    protected $fillable = ['nom', 'slug', 'parent_id', 'description'];

    // Cette fonction s'exécute automatiquement lors de la création d'une catégorie
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($categorie) {
            if (empty($categorie->slug)) {
                $categorie->slug = Str::slug($categorie->nom);
            }
        });
    }

    // Relation pour les sous-catégories (selon ton diagramme)
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