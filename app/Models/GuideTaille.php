<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideTaille extends Model
{
    protected $fillable = ['categorie_id', 'taille', 'poitrine_cm', 'taille_cm', 'hanches_cm', 'pointure'];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }
}