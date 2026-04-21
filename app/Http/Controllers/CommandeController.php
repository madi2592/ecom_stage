<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\HistoriqueStatut;
use App\Models\VarianteProduit;
use App\Services\NumeroCommandeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class CommandeController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validation
        $validated = $request->validate([
            'nom_complet'                => 'required|string|min:3|max:191',
            'telephone'                  => ['required', 'string', 'regex:/^(\+212|0)[67]\d{8}$/'],
            'adresse_livraison'          => 'required_without:google_maps_url|nullable|string',
            'google_maps_url'            => 'required_without:adresse_livraison|nullable|url',
            'emplacement_supplementaire' => 'nullable|string|max:500',
            'email'                      => 'nullable|email|max:191',
            'note_importante'            => 'nullable|string|max:1000',
        ], [
            'nom_complet.required'                => 'Le nom complet est obligatoire.',
            'nom_complet.min'                     => 'Le nom doit contenir au moins 3 caractères.',
            'telephone.required'                  => 'Le numéro de téléphone est obligatoire.',
            'telephone.regex'                     => 'Format invalide. Ex: +212 6X XXX XX XX ou 06 XX XX XX XX',
            'adresse_livraison.required_without'  => 'Veuillez saisir une adresse ou un lien Google Maps.',
            'google_maps_url.required_without'    => 'Veuillez saisir un lien Google Maps ou une adresse.',
            'google_maps_url.url'                 => 'Le lien Google Maps doit être une URL valide.',
        ]);

        $panier = Session::get('panier', []);

        if (empty($panier)) {
            return back()->withErrors(['panier' => 'Votre panier est vide.']);
        }

        try {
            DB::beginTransaction();

            // 2. Calcul du total
            $total = array_sum(array_map(
                fn($item) => $item['prix'] * $item['quantite'],
                $panier
            ));

            // 3. Génération atomique du numéro de commande
            $numeroCommande = NumeroCommandeService::generer();

            // 4. Création de la commande
            $commande = Commande::create([
                'numero_commande'            => $numeroCommande,
                'nom_complet'                => $validated['nom_complet'],
                'telephone'                  => $validated['telephone'],
                'ville'                      => 'Maroc',
                'adresse_livraison'          => $validated['adresse_livraison'] ?? '',
                'emplacement_supplementaire' => $validated['emplacement_supplementaire'] ?? null,
                'google_maps_url'            => $validated['google_maps_url'] ?? null,
                'email'                      => $validated['email'] ?? null,
                'note_importante'            => $validated['note_importante'] ?? null,
                'total_ht'                   => $total,
                'remise'                     => 0,
                'total_ttc'                  => $total,
                'statut'                     => 'Reçu',
            ]);

            // 5. Création des lignes + décrémentation du stock
            foreach ($panier as $item) {
                $variante = VarianteProduit::where('produit_id', $item['id'])
                    ->where('taille', $item['taille'])
                    ->where('couleur', $item['couleur'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($variante->stock < $item['quantite']) {
                    throw new \Exception(
                        "Stock insuffisant pour {$item['libelle']} ({$item['taille']} / {$item['couleur']})."
                    );
                }

                LigneCommande::create([
                    'commande_id'   => $commande->id,
                    'variante_id'   => $variante->id,
                    'quantite'      => $item['quantite'],
                    'prix_unitaire' => $item['prix'],
                ]);

                $variante->decrement('stock', $item['quantite']);
            }

            // 6. Premier jalon dans l'historique
            HistoriqueStatut::create([
                'commande_id' => $commande->id,
                'statut'      => 'Reçu',
                'admin_id'    => null,
            ]);

            DB::commit();

            // Snapshot du panier AVANT de le vider
            $panierSnapshot = array_values($panier);

            // Sauvegarder les articles dans la session pour le PDF
            Session::put('derniere_commande_articles', $panierSnapshot);
            Session::put('derniere_commande_infos', [
                'numero' => $numeroCommande,
                'nom_complet' => $validated['nom_complet'],
                'telephone' => $validated['telephone'],
                'adresse' => $validated['adresse_livraison'] ?? $validated['google_maps_url'] ?? '',
                'email' => $validated['email'] ?? null,
                'note_importante' => $validated['note_importante'] ?? null,
                'emplacement_supplementaire' => $validated['emplacement_supplementaire'] ?? null,
                'total_ttc' => $total,
            ]);

            // Vider le panier
            Session::forget('panier');

            // Redirection avec les données de succès
            return redirect()->route('checkout')->with('commande_confirmee', [
                'numero'      => $numeroCommande,
                'nom_complet' => $validated['nom_complet'],
                'telephone'   => $validated['telephone'],
                'adresse'     => $validated['adresse_livraison'] ?? $validated['google_maps_url'] ?? '',
                'email'       => $validated['email'] ?? null,
                'total_ttc'   => $total,
                'articles'    => $panierSnapshot,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Génère le PDF du reçu de commande
     */
    public function genererRecu($numeroCommande)
    {
        // Récupérer la commande depuis la base de données
        $commande = Commande::where('numero_commande', $numeroCommande)->firstOrFail();
        
        // Récupérer les lignes de commande
        $lignes = LigneCommande::with('variante.produit')
            ->where('commande_id', $commande->id)
            ->get();
        
        // Formater les données pour le PDF
        $articles = [];
        foreach ($lignes as $ligne) {
            $articles[] = [
                'libelle' => $ligne->variante->produit->libelle,
                'taille' => $ligne->variante->taille,
                'couleur' => $ligne->variante->couleur,
                'quantite' => $ligne->quantite,
                'prix_unitaire' => $ligne->prix_unitaire,
                'total' => $ligne->quantite * $ligne->prix_unitaire,
            ];
        }
        
        $data = [
            'commande' => $commande,
            'articles' => $articles,
            'date' => now()->format('d/m/Y à H:i'),
        ];
        
        // Générer le PDF
        $pdf = Pdf::loadView('pdf.recu_commande', $data);
        $pdf->setPaper('a4', 'portrait');
        
        // Télécharger le PDF
        return $pdf->download('recu_commande_' . $numeroCommande . '.pdf');
    }
}