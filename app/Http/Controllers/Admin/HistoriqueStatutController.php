<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\HistoriqueStatut;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoriqueStatutController extends Controller
{
    /**
     * Affiche l'historique complet d'une commande (back-office)
     */
    public function show(Commande $commande)
    {
        $commande->load([
            'historique.admin:id,name',
            'lignes.variante.produit',
        ]);

        return Inertia::render('Admin/Commandes/Historique', [
            'commande'   => $commande,
            'historique' => $commande->historique,
        ]);
    }

    /**
     * Changer le statut d'une commande (admin)
     * Correspond à +changerStatut(statut) du diagramme
     */
    public function changerStatut(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'statut' => 'required|in:recu,approuve,pret_expedition,livraison_en_cours,termine,annule,echec_livraison,recycle',
            'motif'  => 'nullable|string|max:500',
        ]);

        try {
            if ($validated['statut'] === 'annule') {
                $commande->annuler($validated['motif'] ?? null, auth()->id());
            } else {
                $commande->changerStatut(
                    $validated['statut'],
                    $validated['motif'] ?? null,
                    auth()->id()
                );
            }

            return back()->with('success', 'Statut mis à jour avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Recycler une commande annulée (admin)
     * Correspond à +recycler(admin_id) : bool du diagramme
     */
    public function recycler(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'motif' => 'nullable|string|max:500',
        ]);

        try {
            $commande->recycler(auth()->id(), $validated['motif'] ?? null);

            return back()->with('success', 'Commande recyclée avec succès. Elle est prête pour la livraison.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}