<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuideTaille extends Model
{
    use HasFactory;

    protected $fillable = [
        'categorie_id',
        'taille',
        'poitrine_cm',
        'taille_cm',
        'hanches_cm',
        'pointure'
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}