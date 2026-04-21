<?php

use App\Http\Controllers\Admin\GuideTailleController;
use App\Http\Controllers\Admin\HistoriqueStatutController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\ImageProduitController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\VarianteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// La racine du site affiche maintenant la boutique (Front-office)
// Routes Boutique Public
Route::get('/', [ShopController::class, 'index'])->name('shop.index');
Route::get('/catalogue', [ShopController::class, 'catalogue'])->name('shop.catalogue');
Route::get('/produit/{slug}', [ShopController::class, 'show'])->name('shop.show');
Route::get('/api/search', [ShopController::class, 'search'])->name('api.search');

// Ajout de produit au Panier.
Route::prefix('panier')->name('panier.')->group(function () {
    Route::get('/', [PanierController::class, 'index'])->name('index');
    Route::post('/ajouter', [PanierController::class, 'ajouter'])->name('ajouter');
    Route::patch('/update/{cartKey}', [PanierController::class, 'updateQuantite'])->name('update');
    Route::delete('/supprimer/{cartKey}', [PanierController::class, 'supprimer'])->name('supprimer');
    Route::delete('/vider', [PanierController::class, 'vider'])->name('vider');
});
    // Page checkout
    Route::get('/checkout', function () {
        return Inertia::render('Shop/Checkout');
    })->name('checkout');

    // Soumission du formulaire de commande
    Route::post('/commande', [CommandeController::class, 'store'])
        ->name('commande.store');

    // Page de suivi publique (double vérification CMD + téléphone)
    Route::get('/suivi-commande', [CommandeController::class, 'suivi'])
        ->name('commande.suivi');

    // Téléchargement PDF de la facture
    Route::get('/commande/{numeroCMD}/pdf', [CommandeController::class, 'pdf'])
        ->name('commande.pdf');
        // Ajouter cette route avec les autres routes de commande
    Route::get('/commande/{numero}/recu', [CommandeController::class, 'genererRecu'])->name('commande.recu');


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- GROUPE ADMIN PROTÉGÉ (Remplace l'ancien par celui-ci) ---
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // Routes pour les Catégories
    Route::get('/categories', [CategorieController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategorieController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{categorie}', [CategorieController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{categorie}', [CategorieController::class, 'destroy'])->name('categories.destroy');

    // Produits (Toutes les routes CRUD d'un coup)
    Route::post('/produits/{produit}', [ProduitController::class, 'update'])->name('produits.update.post');

    // Route pour supprimer une image spécifique
    Route::delete('/images/{image}', [ImageProduitController::class, 'destroy'])->name('images.destroy'); // update
    Route::resource('produits', ProduitController::class);

    // Routes spécifiques pour les variantes (Ajout/Suppression sans recharger la page)
    Route::post('produits/{produit}/variantes', [VarianteController::class, 'store'])->name('variantes.store');
    Route::delete('variantes/{variante}', [VarianteController::class, 'destroy'])->name('variantes.destroy');

    // Routes pour les guides de tailles
    Route::resource('guides-tailles', GuideTailleController::class)->parameters(['guides-tailles' => 'guides_taille'])->except(['create', 'edit', 'show']);

    // Page de configuration principale
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');

    // Gardez vos routes CRUD pour que les formulaires dans les Partials puissent envoyer les données
    Route::resource('categories', CategorieController::class)->except(['index', 'show']);
    Route::resource('guides-tailles', GuideTailleController::class)->parameters([
        'guides-tailles' => 'guides_taille',
    ])->except(['index', 'show']);

    // Pour le Hero dynamique (slider)
    Route::resource('sliders', SliderController::class);

    
    // ──────────────────────────────────────────────────────────────
    // BACK-OFFICE ADMIN — Historique & Statuts
    // (À placer dans le groupe Route::middleware(['auth'])->prefix('admin'))
    // ──────────────────────────────────────────────────────────────

    Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {

        // Affiche l'historique d'une commande
        Route::get('/commandes/{commande}/historique', [HistoriqueStatutController::class, 'show'])
            ->name('commandes.historique');

        // Changer le statut d'une commande (POST car action avec effets de bord)
        Route::post('/commandes/{commande}/statut', [HistoriqueStatutController::class, 'changerStatut'])
            ->name('commandes.statut');

        // Recycler une commande annulée
        Route::post('/commandes/{commande}/recycler', [HistoriqueStatutController::class, 'recycler'])
            ->name('commandes.recycler');

    });
    
});

require __DIR__.'/auth.php';
