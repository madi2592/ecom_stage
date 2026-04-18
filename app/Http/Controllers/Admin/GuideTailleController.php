<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuideTaille;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuideTailleController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Guides/Index', [
            'guides' => GuideTaille::with('categorie')->get(),
            'categories' => Categorie::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'taille' => 'required|string|max:20',
            'poitrine_cm' => 'nullable|numeric',
            'taille_cm' => 'nullable|numeric',
            'hanches_cm' => 'nullable|numeric',
            'pointure' => 'nullable|string|max:10',
        ]);

        GuideTaille::create($validated);

        return back()->with('success', 'Guide ajouté avec succès.');
    }

    // Correction du paramètre : $guideTaille -> $guide_taille
    public function update(Request $request, GuideTaille $guides_taille)
    {
        $validated = $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'taille' => 'required|string|max:20',
            'poitrine_cm' => 'nullable|numeric',
            'taille_cm' => 'nullable|numeric',
            'hanches_cm' => 'nullable|numeric',
            'pointure' => 'nullable|string|max:10',
        ]);

        $guides_taille->update($validated);

        return back()->with('success', 'Guide mis à jour.');
    }

    // Correction du paramètre : $guideTaille -> $guides_taille
    public function destroy(GuideTaille $guides_taille)
    {
        $guides_taille->delete();
        return back()->with('success', 'Guide supprimé.');
    }
}
