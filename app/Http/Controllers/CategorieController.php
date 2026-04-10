<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategorieController extends Controller
{
    /**
     * Affiche la liste des catégories (Espace Admin)
     */
    public function index()
    {
        // On récupère toutes les catégories avec le nom de leur parent s'il existe
        $categories = Categorie::with('parent')->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Enregistre une nouvelle catégorie
     */
    public function store(Request $request)
    {
        // 1. Validation des données
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        // 2. Création (le slug est géré automatiquement par le modèle)
        Categorie::create($validated);

        // 3. Redirection avec un message de succès
        return redirect()->route('admin.categories.index')
                         ->with('success', 'Catégorie créée avec succès !');
    }
}