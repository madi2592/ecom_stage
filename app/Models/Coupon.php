<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'valeur', 'montant_minimal', 
        'date_expiration', 'limite_utilisation', 
        'utilisations_actuelles', 'est_actif'
    ];
}