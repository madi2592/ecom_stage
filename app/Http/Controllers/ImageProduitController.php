<?php

namespace App\Http\Controllers;

use App\Models\ImageProduit;
use Illuminate\Support\Facades\Storage;

class ImageProduitController extends Controller
{
    public function destroy(ImageProduit $image)
    {
        // Supprimer le fichier physique du storage
        if (Storage::disk('public')->exists($image->chemin)) {
            Storage::disk('public')->delete($image->chemin);
        }

        // Supprimer l'enregistrement en base de données
        $image->delete();

        return back()->with('success', 'Image supprimée avec succès.');
    }
}
