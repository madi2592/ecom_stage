<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Slider;
use App\Models\Variante;
use App\Models\VarianteProduit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    /**
     * Affiche la page d'accueil de la boutique
     */
    public function index()
    {
        return Inertia::render('Shop/Index', [
            // On récupère les sliders actifs, triés par ordre
            'sliders' => Slider::where('est_actif', true)
                ->orderBy('ordre', 'asc')
                ->get(),

            // On garde vos catégories (limité à 4 pour la sidebar ou le menu)
            'categories' => Categorie::withCount('produits')
                ->take(4)
                ->get(),

            // Vos produits avec toutes les relations nécessaires
            'produits' => Produit::with(['images', 'categorie', 'variantes', 'imagePrincipale'])
                ->where('est_actif', true)
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }

    /**
     * Affiche le catalogue complet avec système de filtrage
     */
 public function catalogue(Request $request)
{
    // 1. On prépare la requête de base avec toutes les relations nécessaires
    $query = Produit::with(['images', 'categorie', 'variantes'])
        ->where('est_actif', true);

    // 2. Filtre par catégorie (via le slug)
    if ($request->filled('categorie')) {
        $query->whereHas('categorie', function ($q) use ($request) {
            $q->where('slug', $request->categorie);
        });
    }

    // 3. Filtre par couleur (via les variantes)
    if ($request->filled('color')) {
        $query->whereHas('variantes', function ($q) use ($request) {
            $q->where('couleur', $request->color);
        });
    }

    // 4. Filtre par prix min/max
    if ($request->filled('min_prix')) {
        $query->where('prix', '>=', $request->min_prix);
    }
    if ($request->filled('max_prix')) {
        $query->where('prix', '<=', $request->max_prix);
    }

    // 5. Logique de Tri
    switch ($request->sort) {
        case 'prix_asc':
            $query->orderBy('prix', 'asc');
            break;
        case 'prix_desc':
            $query->orderBy('prix', 'desc');
            break;
        default:
            $query->latest();
            break;
    }

    // 6. On récupère les données pour la Sidebar
    // Note : On utilise withCount pour afficher le nombre de produits par catégorie
    $categories = Categorie::withCount(['produits' => function($q) {
        $q->where('est_actif', true);
    }])->get();

    // Récupération des couleurs uniques existantes en base de données
    $availableColors = \App\Models\VarianteProduit::distinct()
        ->whereNotNull('couleur')
        ->pluck('couleur');

    return Inertia::render('Shop/Catalogue', [
        'produits' => $query->paginate(12)->withQueryString(),
        'categories' => $categories,
        'availableColors' => $availableColors,
        // On renvoie les filtres pour que React puisse les afficher (ex: prix sélectionné)
        'filters' => $request->only(['categorie', 'color', 'min_prix', 'max_prix', 'sort']),
    ]);
}

    /**
     * Affiche le détail d'un produit
     */
    public function show($slug)
    {
        $produit = Produit::with(['images', 'categorie.guides'])
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedProducts = Produit::with(['images', 'categorie'])
            ->where('categorie_id', $produit->categorie_id)
            ->where('id', '!=', $produit->id)
            ->where('est_actif', true) // Correction ici aussi
            ->take(4)
            ->get();

        return Inertia::render('Shop/ProductShow', [
            'produit' => $produit,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
