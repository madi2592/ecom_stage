<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProduitController extends Controller
{
    /**
     * Liste des produits avec catégorie et image principale
     */
    public function index()
    {
        return Inertia::render('Admin/Produits/Index', [
            'produits' => Produit::with(['categorie', 'imagePrincipale', 'images', 'variantes'])
                ->latest()
                ->get(),
            'categories' => Categorie::all(),
        ]);
    }

    public function show(Produit $produit)
    {
        $produit->load([
            'categorie.guides',
            'images',
            'variantes',
        ]);

        // Charger imagePrincipale explicitement sur les produits similaires
        $produitsSimilaires = Produit::query()
            ->with([
                'images' => function ($query) {
                    $query->orderBy('est_principale', 'desc')->orderBy('ordre', 'asc');
                },
            ])
            ->where('categorie_id', $produit->categorie_id)
            ->where('id', '!=', $produit->id)
            ->where('est_actif', true)
            ->latest()
            ->limit(4)
            ->get()
            // Ajouter l'attribut image_principale à chaque produit similaire
            ->map(function ($item) {
                $item->image_principale = $item->images
                    ->where('est_principale', true)
                    ->first()
                    ?? $item->images->first();

                return $item;
            });

       return Inertia::render('Shop/ProductShow', [
    'produit'           => $produit,
    'guide'             => $produit->categorie?->guides->values()->toArray() ?? [],
    'produitsSimilaires'=> $produitsSimilaires,
]);
    }

    /**
     * Store - Création d'un produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|max:50|unique:produits,reference',
            'libelle' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'composition' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'prix_promo' => 'nullable|numeric|min:0|lt:prix',
            'est_actif' => 'boolean',
            // 1. On valide un tableau d'images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:6144',
        ]);

        try {
            DB::beginTransaction();

            $produit = Produit::create([
                'reference' => $validated['reference'],
                'libelle' => $validated['libelle'],
                'categorie_id' => $validated['categorie_id'],
                'description' => $validated['description'] ?? null,
                'composition' => $validated['composition'] ?? null,
                'prix' => $validated['prix'],
                'prix_promo' => $validated['prix_promo'] ?? null,
                'est_actif' => $request->boolean('est_actif', true),
            ]);

            // 2. Gestion de plusieurs images
            if ($request->hasFile('images')) {
                $files = $request->file('images');

                foreach ($files as $index => $file) {
                    $path = $file->store('produits', 'public');

                    $produit->images()->create([
                        'chemin' => $path,
                        'est_principale' => $index === 0, // La première image devient la principale
                        'ordre' => $index,
                    ]);
                }
            }

            DB::commit();

            return Redirect::route('admin.produits.index')->with('success', 'Produit créé avec succès !');
        } catch (\Exception $e) {
            DB::rollBack();

            // Note: Le nettoyage des fichiers en cas d'erreur nécessiterait un tableau de chemins ici
            return back()->withErrors(['error' => 'Erreur : '.$e->getMessage()]);
        }
    }

    /**
     * Update - Mise à jour d'un produit
     */
    public function update(Request $request, Produit $produit)
    {
        // 1. Validation étendue pour inclure les images
        $validated = $request->validate([
            'reference' => 'required|string|max:50|unique:produits,reference,'.$produit->id,
            'libelle' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'composition' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'prix_promo' => 'nullable|numeric|min:0|lt:prix',
            'est_actif' => 'boolean',
            // Ajout de la validation des images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:6144',
        ]);

        try {
            DB::beginTransaction();

            // 2. Mise à jour des informations de base
            $produit->update([
                'reference' => $validated['reference'],
                'libelle' => $validated['libelle'],
                'categorie_id' => $validated['categorie_id'],
                'description' => $validated['description'] ?? null,
                'composition' => $validated['composition'] ?? null,
                'prix' => $validated['prix'],
                'prix_promo' => $validated['prix_promo'] ?? null,
                'est_actif' => $request->boolean('est_actif'),
            ]);

            // 3. Gestion des nouvelles images
            if ($request->hasFile('images')) {
                // On récupère le dernier index d'ordre pour ne pas écraser les existantes
                $dernierOrdre = $produit->images()->max('ordre') ?? -1;

                foreach ($request->file('images') as $index => $file) {
                    $path = $file->store('produits', 'public');

                    $produit->images()->create([
                        'chemin' => $path,
                        // Si le produit n'a aucune image, la première de la liste devient principale
                        'est_principale' => ($produit->images()->count() === 0 && $index === 0),
                        'ordre' => $dernierOrdre + 1 + $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Produit mis à jour avec ses images !');
        } catch (\Exception $e) {
            DB::rollBack();

            // En cas d'erreur (ex: disque plein), on renvoie l'erreur au formulaire
            return back()->withErrors(['error' => 'Erreur lors de la mise à jour : '.$e->getMessage()]);
        }
    }

    /**
     * Destroy - Suppression
     */
    public function destroy(Produit $produit)
    {
        try {
            DB::beginTransaction();

            // 1. Charger explicitement les images pour accéder aux chemins des fichiers
            $images = $produit->images;

            // 2. Nettoyage du stockage physique
            foreach ($images as $image) {
                // On vérifie si le fichier existe avant de tenter la suppression
                if (Storage::disk('public')->exists($image->chemin)) {
                    Storage::disk('public')->delete($image->chemin);
                }
            }

            // 3. Suppression du produit
            // Note : Si vos migrations (images et variantes) ont ->onDelete('cascade'),
            // les records en base de données disparaîtront automatiquement ici.
            $produit->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Produit et fichiers associés supprimés avec succès !');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Erreur lors de la suppression : '.$e->getMessage()]);
        }
    }
}
