<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    protected $fillable = ['titre', 'sous_titre', 'image_path', 'ordre', 'est_actif'];

    // Pour inclure automatiquement l'url de l'image dans le JSON envoyé à React
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}