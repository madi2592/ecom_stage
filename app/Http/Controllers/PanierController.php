<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class PanierController extends Controller
{
    /**
     * Affiche la page du panier
     * ✅ panier n'est plus passé ici — il est déjà partagé globalement
     *    via HandleInertiaRequests::share() → usePage().props.panier
     */
    public function index()
    {
        return Inertia::render('Shop/Cart');
    }

    /**
     * Ajoute un produit au panier (ou incrémente si déjà présent)
     */
    public function ajouter(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite'   => 'required|integer|min:1',
            'taille'     => 'required|string',
            'couleur'    => 'required|string',
        ]);

        $produit = Produit::with('imagePrincipale')->findOrFail($request->produit_id);

        // Clé unique pour différencier les variantes (ex: 5-XL-Bleu)
        $cartKey = $produit->id . '-' . $request->taille . '-' . $request->couleur;
        $panier  = Session::get('panier', []);

        if (isset($panier[$cartKey])) {
            $panier[$cartKey]['quantite'] += $request->quantite;
        } else {
            $panier[$cartKey] = [
                'cart_key' => $cartKey,
                'id'       => $produit->id,
                'libelle'  => $produit->libelle,
                'prix'     => $produit->prix_promo ?? $produit->prix,
                'image'    => $produit->imagePrincipale ? $produit->imagePrincipale->chemin : null,
                'taille'   => $request->taille,
                'couleur'  => $request->couleur,
                'quantite' => $request->quantite,
                'slug'     => $produit->slug,
            ];
        }

        Session::put('panier', $panier);

        return back()->with('success', 'Produit ajouté au panier !');
    }

    /**
     * Augmente ou diminue la quantité d'un article spécifique
     */
    public function updateQuantite(Request $request, $cartKey)
    {
        $panier = Session::get('panier', []);

        if (isset($panier[$cartKey])) {
            if ($request->action === 'plus') {
                $panier[$cartKey]['quantite']++;
            } elseif ($request->action === 'moins' && $panier[$cartKey]['quantite'] > 1) {
                $panier[$cartKey]['quantite']--;
            }

            Session::put('panier', $panier);
        }

        return back();
    }

    /**
     * Supprime un article spécifique du panier
     */
    public function supprimer($cartKey)
    {
        $panier = Session::get('panier', []);

        if (isset($panier[$cartKey])) {
            unset($panier[$cartKey]);
            Session::put('panier', $panier);
        }

        return back()->with('info', 'L\'article a été retiré de votre panier.');
    }

    /**
     * Vide le panier complètement
     */
    public function vider()
    {
        Session::forget('panier');

        return back()->with('warning', 'Votre panier a été vidé.');
    }
}