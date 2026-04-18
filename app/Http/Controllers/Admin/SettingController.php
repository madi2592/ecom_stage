<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Models\GuideTaille;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Affiche la page de configuration avec les catégories et les guides.
     */
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            // On récupère les catégories avec le nom de leur parent pour le tableau
            'categories' => Categorie::with('parent')->latest()->get(),
            
            // On récupère les guides avec le nom de leur catégorie
            'guides' => GuideTaille::with('categorie')->latest()->get(),
            
            // On renvoie aussi la liste simple des catégories pour les menus déroulants des formulaires
            'categoriesList' => Categorie::select('id', 'nom')->get(),
        ]);
    }
}