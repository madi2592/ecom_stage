<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de commande - {{ $commande->numero_commande }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            background: white;
            padding: 40px;
            color: #1a1a1a;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        
        /* En-tête */
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #0315ff;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 3px;
            color: #0315ff;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 12px;
            color: #666;
            letter-spacing: 1px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 800;
            margin: 20px 0 10px;
            text-transform: uppercase;
        }
        
        /* Infos commande */
        .order-info {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .order-number {
            font-size: 18px;
            font-weight: bold;
            color: #0315ff;
            margin-bottom: 10px;
        }
        
        .order-date {
            font-size: 12px;
            color: #666;
        }
        
        /* Grille informations */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-section {
            background: #fafafa;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #0315ff;
        }
        
        .info-section h3 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #0315ff;
            text-transform: uppercase;
        }
        
        .info-section p {
            font-size: 12px;
            line-height: 1.5;
            color: #333;
            margin-bottom: 5px;
        }
        
        /* Tableau produits */
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .products-table th {
            background: #0315ff;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12px;
        }
        
        .products-table tr:last-child td {
            border-bottom: none;
        }
        
        /* Totaux */
        .totals {
            text-align: right;
            margin-bottom: 30px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
        }
        
        .total-line {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }
        
        .total-label {
            font-size: 14px;
            font-weight: bold;
            width: 150px;
            text-align: left;
        }
        
        .total-value {
            font-size: 14px;
            width: 100px;
            text-align: right;
        }
        
        .grand-total {
            font-size: 18px;
            font-weight: bold;
            color: #0315ff;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #0315ff;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding-top: 30px;
            margin-top: 30px;
            border-top: 1px solid #e0e0e0;
            font-size: 10px;
            color: #999;
        }
        
        .payment-info {
            background: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .badge {
            display: inline-block;
            background: #0315ff;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <div class="logo">CLICK'N'BUY</div>
            <div class="subtitle">Votre boutique en ligne</div>
            <h1 class="title">BON DE COMMANDE</h1>
        </div>
        
        <!-- Infos commande -->
        <div class="order-info">
            <div class="order-number">N° COMMANDE : {{ $commande->numero_commande }}</div>
            <div class="order-date">Date : {{ $date }}</div>
        </div>
        
        <!-- Grille informations client -->
        <div class="info-grid">
            <div class="info-section">
                <h3>Informations client</h3>
                <p><strong>Nom complet :</strong> {{ $commande->nom_complet }}</p>
                <p><strong>Téléphone :</strong> {{ $commande->telephone }}</p>
                @if($commande->email)
                    <p><strong>Email :</strong> {{ $commande->email }}</p>
                @endif
            </div>
            
            <div class="info-section">
                <h3>Adresse de livraison</h3>
                <p>{{ $commande->adresse_livraison ?: 'Adresse fournie via Google Maps' }}</p>
                @if($commande->emplacement_supplementaire)
                    <p><strong>Complément :</strong> {{ $commande->emplacement_supplementaire }}</p>
                @endif
                @if($commande->google_maps_url)
                    <p><strong>Google Maps :</strong> <a href="{{ $commande->google_maps_url }}" style="color: #0315ff;">Voir l'emplacement</a></p>
                @endif
            </div>
        </div>
        
        <!-- Tableau des produits -->
        <table class="products-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Taille / Couleur</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($articles as $article)
                <tr>
                    <td>{{ $article['libelle'] }}</td>
                    <td>{{ $article['taille'] }} / {{ $article['couleur'] }}</td>
                    <td>{{ $article['quantite'] }}</td>
                    <td>{{ number_format($article['prix_unitaire'], 2) }} DH</td>
                    <td>{{ number_format($article['total'], 2) }} DH</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <!-- Totaux -->
        <div class="totals">
            <div class="total-line">
                <span class="total-label">Sous-total :</span>
                <span class="total-value">{{ number_format($commande->total_ht, 2) }} DH</span>
            </div>
            <div class="total-line">
                <span class="total-label">Livraison :</span>
                <span class="total-value">Gratuite</span>
            </div>
            <div class="total-line grand-total">
                <span class="total-label">TOTAL TTC :</span>
                <span class="total-value">{{ number_format($commande->total_ttc, 2) }} DH</span>
            </div>
        </div>
        
        <!-- Informations de paiement -->
        <div class="payment-info">
            <div class="badge">Mode de paiement</div>
            <p><strong>Paiement à la livraison (PAL)</strong></p>
            <p style="font-size: 11px; margin-top: 5px;">Vous réglez en espèces (MAD) au livreur lors de la réception de votre colis.</p>
        </div>
        
        <!-- Note importante -->
        @if($commande->note_importante)
        <div class="info-section" style="margin-top: 20px;">
            <h3>Note importante</h3>
            <p>{{ $commande->note_importante }}</p>
        </div>
        @endif
        
        <!-- Footer -->
        <div class="footer">
            <p>Merci de votre confiance ! Notre équipe vous contactera sous 4 à 24h pour confirmer votre commande.</p>
            <p style="margin-top: 10px;">Click'n'Buy - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>