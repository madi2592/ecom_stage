<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
    protected $table = 'commandes';

    protected $fillable = [
        'numero_commande',
        'nom_complet',
        'telephone',
        'ville',
        'adresse_livraison',
        'emplacement_supplementaire',
        'google_maps_url',
        'email',
        'note_importante',
        'source',           // 'web' | 'telephone'
        'statut',
        'total_ht',
        'remise',
        'total_ttc',
        'coupon_id',
        'reduction',
        'terms_accepted_at',
        'notes_admin',
    ];

    protected $casts = [
        'total_ht'          => 'decimal:2',
        'total_ttc'         => 'decimal:2',
        'remise'            => 'decimal:2',
        'reduction'         => 'decimal:2',
        'terms_accepted_at' => 'datetime',
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
    ];

    // ── Relations ─────────────────────────────────────────────────────────

    public function lignes(): HasMany
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function historique(): HasMany
    {
        return $this->hasMany(HistoriqueStatut::class)->orderBy('created_at');
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    // ── Méthodes du diagramme de classe ───────────────────────────────────

    /**
     * +changerStatut(statut) : void
     * Change le statut + enregistre automatiquement un jalon d'historique.
     */
    public function changerStatut(string $statut, ?string $motif = null, ?int $adminId = null): void
    {
        $this->update(['statut' => $statut]);

        HistoriqueStatut::enregistrer(
            commandeId: $this->id,
            statut: $statut,
            motif: $motif,
            adminId: $adminId,
        );
    }

    /**
     * +annuler(motif) : void
     * Annule la commande et remet les stocks à jour.
     */
    public function annuler(?string $motif = null, ?int $adminId = null): void
    {
        if (in_array($this->statut, ['pret_expedition', 'livraison_en_cours', 'termine', 'annule'])) {
            throw new \Exception("Impossible d'annuler une commande au statut : {$this->statut}.");
        }

        // Réincrémenter les stocks
        foreach ($this->lignes as $ligne) {
            $ligne->variante->incrementeStock($ligne->quantite);
        }

        $this->changerStatut('annule', $motif, $adminId);
    }

    /**
     * +recycler(admin_id) : bool
     * Recycle une commande annulée après re-confirmation téléphonique.
     * Vérifie le stock avant de relancer.
     */
    public function recycler(int $adminId, ?string $motif = null): bool
    {
        if ($this->statut !== 'annule') {
            return false;
        }

        // Vérification stock pour chaque ligne
        foreach ($this->lignes as $ligne) {
            if ($ligne->variante->stock < $ligne->quantite) {
                throw new \Exception(
                    "Stock insuffisant pour relancer la commande : {$ligne->variante->produit->libelle} ({$ligne->variante->taille}/{$ligne->variante->couleur})."
                );
            }
        }

        // Décrémenter les stocks
        foreach ($this->lignes as $ligne) {
            $ligne->variante->decrementeStock($ligne->quantite);
        }

        // Enregistrer le recyclage
        RecyclageCommande::create([
            'commande_id'    => $this->id,
            'admin_id'       => $adminId,
            'motif'          => $motif,
            'stock_verifie'  => true,
        ]);

        $this->changerStatut('recycle', $motif, $adminId);

        return true;
    }

    /**
     * +calculerTotal() : decimal
     */
    public function calculerTotal(): float
    {
        return $this->lignes->sum(fn($l) => $l->quantite * $l->prix_unitaire);
    }

    /**
     * +verifierAccesParTelephone(tel) : bool
     * Double vérification CMD + téléphone pour la page de suivi.
     */
    public static function verifierAccesParTelephone(string $numeroCMD, string $telephone): ?self
    {
        return self::where('numero_commande', $numeroCMD)
                   ->where('telephone', $telephone)
                   ->first();
    }

    /**
     * +telechargerFacturePDF() : fichier
     * Génère une facture PDF (implémentation dans le controller avec DomPDF).
     */
    public function telechargerFacturePDF(): string
    {
        // Retourne le chemin du PDF généré — logique dans PdfService
        return route('commande.pdf', $this->numero_commande);
    }
}