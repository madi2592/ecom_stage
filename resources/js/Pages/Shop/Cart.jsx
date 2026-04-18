import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, X } from 'lucide-react';

// Composant ConfirmDialog inline (léger, sans dépendance externe)
function ConfirmInline({ show, title, message, onConfirm, onClose }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-base font-black uppercase tracking-tight text-black">{title}</h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-black ml-4">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-widest border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Cart() {
    // ✅ panier récupéré depuis les props partagées (HandleInertiaRequests)
    // Le contrôleur n'a plus besoin de le passer lui-même
    const { panier } = usePage().props;

    // On s'assure que items est toujours un tableau, même si panier est vide/null
    const items = panier ? Object.values(panier) : [];

    const total = items.reduce((acc, item) => {
        return acc + (Number(item.prix) * Number(item.quantite));
    }, 0);

    // ── États pour les dialogs de confirmation ──
    const [removeDialog, setRemoveDialog] = useState(false);   // stocke cart_key
    const [clearDialog, setClearDialog]   = useState(false);

    // Fonctions de gestion
    const updateQty = (cartKey, action) => {
        router.patch(route('panier.update', cartKey), { action }, { preserveScroll: true });
    };

    const confirmRemoveItem = () => {
        if (!removeDialog) return;
        router.delete(route('panier.supprimer', removeDialog), {
            onFinish: () => setRemoveDialog(false),
        });
    };

    const confirmClearCart = () => {
        router.delete(route('panier.vider'), {
            onFinish: () => setClearDialog(false),
        });
    };

    return (
        <FrontLayout>
            <Head title="Mon Panier | Click'n'Buy" />

            {/* Dialogs de confirmation */}
            <ConfirmInline
                show={Boolean(removeDialog)}
                title="Retirer cet article ?"
                message="Cet article sera retiré de votre panier."
                onConfirm={confirmRemoveItem}
                onClose={() => setRemoveDialog(false)}
            />
            <ConfirmInline
                show={clearDialog}
                title="Vider le panier ?"
                message="Tous les articles de votre panier seront supprimés."
                onConfirm={confirmClearCart}
                onClose={() => setClearDialog(false)}
            />

            <div className="bg-[#f9f9f9] min-h-screen py-10 sm:py-20">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Fil d'ariane / Retour */}
                    <div className="mb-10">
                        <Link href={route('shop.catalogue')} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#0315ff] transition-colors">
                            <ArrowLeft size={14} /> Continuer mes achats
                        </Link>
                        <h1 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-tighter mt-4">
                            Votre Panier
                        </h1>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                            {/* SECTION GAUCHE : LISTE DES PRODUITS */}
                            <div className="lg:col-span-8 space-y-4">
                                {/* Header du tableau (visible uniquement sur desktop) */}
                                <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-white border border-gray-100 rounded-t-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <div className="col-span-6">Produit</div>
                                    <div className="col-span-3 text-center">Quantité</div>
                                    <div className="col-span-3 text-right">Total</div>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.cart_key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:grid md:grid-cols-12 items-center gap-6">

                                            {/* Détails Produit */}
                                            <div className="col-span-6 flex items-center gap-6 w-full">
                                                <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            className="w-full h-full object-cover"
                                                            alt={item.libelle}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                            <ShoppingBag size={28} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-black text-black uppercase text-sm leading-tight mb-1">{item.libelle}</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                                        {item.taille} — {item.couleur}
                                                    </p>
                                                    {/* ✅ Bouton supprimer → ConfirmInline */}
                                                    <button
                                                        onClick={() => setRemoveDialog(item.cart_key)}
                                                        className="inline-flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Supprimer
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sélecteur de Quantité */}
                                            <div className="col-span-3 flex justify-center w-full">
                                                <div className="flex items-center border-2 border-gray-50 rounded-xl p-1">
                                                    <button
                                                        onClick={() => updateQty(item.cart_key, 'moins')}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Minus size={16} className="text-black" />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-black">{item.quantite}</span>
                                                    <button
                                                        onClick={() => updateQty(item.cart_key, 'plus')}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Plus size={16} className="text-black" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Prix Total Ligne */}
                                            <div className="col-span-3 text-right w-full">
                                                <p className="font-black text-xl text-[#0315ff]">
                                                    {(item.prix * item.quantite).toFixed(2)} <span className="text-xs uppercase">DH</span>
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {item.prix} DH / unité
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions secondaires */}
                                <div className="flex justify-end pt-4">
                                    {/* ✅ Bouton vider → ConfirmInline */}
                                    <button
                                        onClick={() => setClearDialog(true)}
                                        className="text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-500 pb-1"
                                    >
                                        Vider le panier complet
                                    </button>
                                </div>
                            </div>

                            {/* SECTION DROITE : RÉSUMÉ & CHECKOUT */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-28">
                                    <h2 className="text-lg font-black text-black uppercase tracking-widest mb-8 border-b pb-4">
                                        Résumé de la commande
                                    </h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                            <span>Sous-total</span>
                                            <span className="text-black">{total.toFixed(2)} DH</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                            <span>Livraison</span>
                                            <span className="text-green-600">Gratuite</span>
                                        </div>
                                        <div className="pt-6 border-t flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-black">Total</span>
                                            <span className="text-3xl font-black text-black leading-none">
                                                {total.toFixed(2)} <span className="text-sm">DH</span>
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-[#0315ff] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/20 hover:shadow-black/20">
                                        Passer à la caisse
                                    </button>

                                    <div className="mt-8 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                                Paiement à la livraison disponible
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* ÉTAT VIDE */
                        <div className="bg-white rounded-3xl p-16 sm:p-32 text-center border border-gray-100 shadow-sm">
                            <div className="max-w-xs mx-auto">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <ShoppingBag className="text-gray-200" size={40} />
                                </div>
                                <h2 className="text-xl font-black text-black uppercase tracking-tight mb-4">Votre panier est vide</h2>
                                <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                                    Il semble que vous n'ayez pas encore ajouté de coups de cœur à votre panier.
                                </p>
                                <Link
                                    href={route('shop.catalogue')}
                                    className="block w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#0315ff] transition-all"
                                >
                                    Explorer le catalogue
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}