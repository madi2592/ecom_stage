import React, { useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import {
    ChevronRight,
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    Share2,
    Ruler,
    Truck,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';

const COLOR_MAP = {
    'Rouge': '#E53E3E',
    'Bleu': '#3182CE',
    'Vert': '#38A169',
    'Noir': '#1A202C',
    'Blanc': '#F7FAFC',
    'Gris': '#718096',
    'Jaune': '#ECC94B',
    'Rose': '#ED64A6',
    'Beige': '#D4A574',
    'Marine': '#2C3E80',
    'Orange': '#ED8936',
    'Violet': '#805AD5',
};

export default function Show({ auth, produit, relatedProducts = [] }) {
    const guide = produit?.categorie?.guides ?? [];
    const produitsSimilaires = relatedProducts;
    // 1. Initialisation du formulaire avec Inertia
    const { data, setData, post, processing, errors } = useForm({
        produit_id: produit.id,
        quantite: 1,
        taille: '',
        couleur: '',
    });

    const [activeImage, setActiveImage] = useState(0);
    const [pageSimilaires, setPageSimilaires] = useState(0);
    const ITEMS_PER_PAGE = 4;

    const similairesPagines = useMemo(() => {
        const start = pageSimilaires * ITEMS_PER_PAGE;
        return produitsSimilaires.slice(start, start + ITEMS_PER_PAGE);
    }, [produitsSimilaires, pageSimilaires]);

    const totalPages = Math.ceil(produitsSimilaires.length / ITEMS_PER_PAGE);

    const handleCommander = (e) => {
        e.preventDefault();
        post(route('panier.ajouter'), {
            onSuccess: () => {
                window.location.href = route('panier.index');
            },
        });
    };

    // 2. Logique de filtrage des variantes
    const variantes = produit.variantes || [];

    // Extraire les couleurs uniques
    const couleursDisponibles = useMemo(() =>
        [...new Set(variantes.map(v => v.couleur))],
        [variantes]);

    // Extraire les tailles disponibles pour la couleur sélectionnée
    const taillesDisponibles = useMemo(() => {
        if (!data.couleur) return [];
        return variantes
            .filter(v => v.couleur === data.couleur)
            .map(v => v.taille);
    }, [data.couleur, variantes]);

    // Trouver la variante spécifique pour obtenir le stock
    const stockVariante = useMemo(() => {
        const v = variantes.find(v => v.couleur === data.couleur && v.taille === data.taille);
        return v ? v.stock : null;
    }, [data.couleur, data.taille, variantes]);

    // 3. Handlers
    const handleColorChange = (couleur) => {
        setData((prev) => ({
            ...prev,
            couleur: couleur,
            taille: '', // Correction : Réinitialisation de la taille pour éviter les combinaisons invalides
        }));
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('panier.ajouter'), {
            onSuccess: () => {
                // Ici tu pourrais ajouter un toast ou ouvrir un drawer
                alert('Produit ajouté au panier !');
            },
        });
    };

    return (
        <FrontLayout>
        <div className="min-h-screen bg-white">
            <Head title={produit.libelle} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                    <a href="/" className="hover:text-black transition-colors">Accueil</a>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-black font-medium">{produit.libelle}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* --- COLONNE GAUCHE : IMAGES --- */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative group">
                            <img
                                src={`/storage/${produit.images[activeImage]?.chemin}`}
                                alt={produit.libelle}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {produit.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent'
                                        }`}
                                >
                                    <img src={`/storage/${img.chemin}`} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- COLONNE DROITE : INFOS & ACHAT --- */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">
                                {produit.libelle}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-black' : 'text-gray-300'}`} />
                                    ))}
                                    <span className="ml-2 text-sm font-medium">(12 avis)</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm text-green-600 font-bold uppercase tracking-widest">En Stock</span>
                            </div>
                            <div className="flex items-baseline space-x-3">
                                <span className="text-4xl font-black text-[#0315ff]">
                                    {produit.prix_promo || produit.prix} DH
                                </span>
                                {produit.prix_promo && (
                                    <span className="text-xl text-gray-400 line-through font-medium">
                                        {produit.prix} DH
                                    </span>
                                )}
                            </div>
                            {produit.description && (
                                <p className="mt-5 text-sm text-gray-500 leading-relaxed border-l-2 border-[#0315ff] pl-4">
                                    {produit.description}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleAddToCart} className="space-y-8">
                            {/* Choix Couleur */}
                            <div>
                                <h3 className="text-xs  text-gray-950 font-bold  uppercase tracking-[0.2em] mb-4">Couleur</h3>
                                <div className="flex flex-wrap gap-3">
                                    {couleursDisponibles.map((couleur) => {
                                        const hex = COLOR_MAP[couleur] ?? '#CCCCCC';
                                        const isSelected = data.couleur === couleur;
                                        const isWhite = couleur === 'Blanc';
                                        return (
                                            <button
                                                key={couleur}
                                                type="button"
                                                onClick={() => handleColorChange(couleur)}
                                                title={couleur}
                                                className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${isSelected
                                                        ? 'border-black scale-110 ring-2 ring-offset-2 ring-gray-400'
                                                        : isWhite
                                                            ? 'border-gray-300 hover:border-black'
                                                            : 'border-transparent hover:border-black'
                                                    }`}
                                                style={{ backgroundColor: hex }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Choix Taille */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs  text-gray-950 font-bold  uppercase tracking-[0.2em]">Taille</h3>
                                    <button type="button" className="text-xs flex items-center underline font-bold tracking-widest">
                                        <Ruler className="w-4 h-4 mr-1" /> GUIDE DES TAILLES
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {taillesDisponibles.length > 0 ? (
                                        taillesDisponibles.map((taille) => (
                                            <button
                                                key={taille}
                                                type="button"
                                                onClick={() => setData('taille', taille)}
                                                className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 text-sm font-black transition-all ${data.taille === taille
                                                        ? 'bg-[#0315ff] text-white border-[#0315ff]'
                                                        : 'border-gray-100 hover:border-black'
                                                    }`}
                                            >
                                                {taille}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Sélectionnez d'abord une couleur</p>
                                    )}
                                </div>
                            </div>

                            {/* Quantité & Actions */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs text-gray-950 font-bold uppercase tracking-[0.2em] mb-3">Quantité</h3>
                                    <div className="flex items-center border-2 border-gray-100 rounded-xl w-36 justify-between p-1">
                                        <button
                                            type="button"
                                            onClick={() => setData('quantite', Math.max(1, data.quantite - 1))}
                                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                            aria-label="Diminuer la quantité"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-black text-lg">{data.quantite}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Correction : Limitation par le stock réel
                                                if (stockVariante === null || data.quantite < stockVariante) {
                                                    setData('quantite', data.quantite + 1);
                                                }
                                            }}
                                            disabled={stockVariante !== null && data.quantite >= stockVariante}
                                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-30"
                                            aria-label="Augmenter la quantité"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Boutons principaux */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.taille || !data.couleur}
                                        className="flex-1 h-14 bg-black text-white rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-[0.15em] text-sm hover:bg-gray-900 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="w-5 h-5 shrink-0" />
                                        <span class="text-sm">{processing ? 'Chargement...' : 'Ajouter au panier'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="h-14 w-14 shrink-0 flex items-center justify-center border-2 border-gray-100 rounded-xl hover:border-black hover:text-black transition-all text-gray-400"
                                        aria-label="Ajouter aux favoris"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCommander}
                                    disabled={processing || !data.taille || !data.couleur}
                                    className="w-full h-14 bg-[#0315ff] text-white rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-[0.15em] text-sm hover:bg-blue-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    <span class="text-sm">{processing ? 'Chargement...' : '⚡ Commander maintenant'}</span>
                                </button>
                            </div>
                        </form>

                        {/* Guide des tailles - Sécurisé avec ?.map */}
                        <div className="mt-12 border-t pt-8">
                            <h3 className="text-xl text-gray-900 mb-6 uppercase">Guide des tailles</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border shadow-sm">
                                    <thead>
                                        <tr className="border-b-2 border-black">
                                            <th className="py-3 font-black uppercase tracking-widest">Taille</th>
                                            <th className="py-3 text-center font-black uppercase tracking-widest text-gray-400">Poitrine (cm)</th>
                                            <th className="py-3 text-center font-black uppercase tracking-widest text-gray-400">Taille (cm)</th>
                                            <th className="py-3 text-center font-black uppercase tracking-widest text-gray-400">Hanches (cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Correction : Sécurité contre le undefined/null */}
                                        {guide && guide.length > 0 ? (
                                            guide.map((gt, idx) => (
                                                <tr key={gt.id || idx} className="border border-gray-100">
                                                    <td className="py-4 font-black uppercase">{gt.taille}</td>
                                                    <td className="py-4 text-center text-gray-600">{gt.poitrine_cm || '—'}</td>
                                                    <td className="py-4 text-center text-gray-600">{gt.taille_cm || '—'}</td>
                                                    <td className="py-4 text-center text-gray-600">{gt.hanches_cm || '—'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-4 text-gray-400 italic">Aucun guide disponible pour cette catégorie.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Produits Similaires */}
                {produitsSimilaires.length > 0 && (
                    <div className="mt-20 border-t pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Produits Similaires</h2>
                            <span className="text-sm text-gray-400 font-medium">{produitsSimilaires.length} produit{produitsSimilaires.length > 1 ? 's' : ''}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similairesPagines.map((item) => {
                                const imgPath = item.image_principale?.chemin ?? item.images?.[0]?.chemin;
                                const prix = item.prix_promo || item.prix;
                                return (
                                    <Link
                                        key={item.id}
                                        href={route('shop.show', item.slug)}
                                        className="group block"
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                                            {imgPath ? (
                                                <img
                                                    src={`/storage/${imgPath}`}
                                                    alt={item.libelle}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                                                    Pas d'image
                                                </div>
                                            )}
                                            {item.prix_promo && (
                                                <span className="absolute top-2 left-2 bg-[#0315ff] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                                                    Promo
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-tight text-gray-900 truncate group-hover:text-[#0315ff] transition-colors">
                                            {item.libelle}
                                        </p>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="text-sm font-black text-[#0315ff]">{prix} DH</span>
                                            {item.prix_promo && (
                                                <span className="text-xs text-gray-400 line-through">{item.prix} DH</span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-10">
                                <button
                                    onClick={() => setPageSimilaires((p) => Math.max(0, p - 1))}
                                    disabled={pageSimilaires === 0}
                                    className="px-5 py-2 border-2 border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ← Précédent
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPageSimilaires(i)}
                                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${pageSimilaires === i ? 'bg-[#0315ff] text-white' : 'border-2 border-gray-100 hover:border-black'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPageSimilaires((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={pageSimilaires === totalPages - 1}
                                    className="px-5 py-2 border-2 border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Suivant →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
        </FrontLayout>
    );
}