<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    protected $fillable = [
        'commande_id', 'variante_id', 'quantite', 'prix_unitaire',
    ];

    public function variante()
    {
        return $this->belongsTo(VarianteProduit::class, 'variante_id');
    }
}