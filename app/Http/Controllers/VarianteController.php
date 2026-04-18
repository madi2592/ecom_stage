<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\VarianteProduit;
use Illuminate\Http\Request;

class VarianteController extends Controller
{
    /**
     * Ajouter une variante à un produit spécifique
     */
    public function store(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'taille' => 'required|string|max:20',
            'couleur' => 'required|string|max:50',
            'stock' => 'required|integer|min:0',
            'image_url' => 'nullable|string', // Pour une future gestion d'images par couleur
        ]);

        // Vérification pour éviter les doublons (même taille + même couleur pour ce produit)
        $exists = $produit->variantes()
            ->where('taille', $validated['taille'])
            ->where('couleur', $validated['couleur'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['variante' => 'Cette variante existe déjà.']);
        }

        $produit->variantes()->create($validated);

        return back()->with('success', 'Variante ajoutée avec succès.');
    }

    /**
     * Supprimer une variante
     */
    public function destroy(VarianteProduit $variante)
    {
        $variante->delete();

        return back()->with('success', 'Variante supprimée.');
    }
}