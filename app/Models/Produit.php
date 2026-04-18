<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Ajouté pour les seeders
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Produit extends Model
{
    use HasFactory; // Ajouté

    protected $fillable = [
        'reference',
        'libelle',
        'slug',
        'categorie_id',
        'description',
        'prix',
        'prix_promo',
        'est_actif',
    ];

    /**
     * Pour que le stock total soit visible dans Inertia (React)
     */
    protected $appends = ['stock_total'];

    /**
     * Boot function pour générer le slug automatiquement
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($produit) {
            if (empty($produit->slug)) {
                $produit->slug = Str::slug($produit->libelle);
            }
        });

        // Optionnel : met à jour le slug si le libellé change
        static::updating(function ($produit) {
            if ($produit->isDirty('libelle') && empty($produit->slug)) {
                $produit->slug = Str::slug($produit->libelle);
            }
        });
    }

    /**
     * RELATIONS
     */
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function images(): HasMany
    {
        // On s'assure que les images sont toujours ordonnées
        return $this->hasMany(ImageProduit::class)->orderBy('ordre');
    }

    public function imagePrincipale(): HasOne
    {
        return $this->hasOne(ImageProduit::class)->where('est_principale', true);
    }

    public function variantes(): HasMany
    {
        return $this->hasMany(VarianteProduit::class);
    }

    /**
     * ACCESSEURS (Attributes)
     */
    public function getStockTotalAttribute()
    {
        // Sécurité : si les variantes ne sont pas chargées, on retourne 0
        return $this->variantes ? $this->variantes->sum('stock') : 0;
    }
}
