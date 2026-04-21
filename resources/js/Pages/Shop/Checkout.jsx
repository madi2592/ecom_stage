import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import {
    MapPin, Link2, Phone, Mail, MessageSquare, Info,
    CheckCircle2, Loader2, ChevronRight, AlertCircle, X,
    ShoppingBag, FileText
} from 'lucide-react';

// ── Champ de formulaire générique ─────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-[0.15em] text-gray-700">
                    {label}
                    {required && <span className="text-[#0315ff] ml-1">*</span>}
                </label>
                {hint && <span className="text-[10px] text-gray-400 italic">{hint}</span>}
            </div>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle size={12} className="shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass = (error) =>
    `w-full h-11 px-4 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-300 
    focus:outline-none transition-all duration-200
    ${error
        ? 'border-red-300 focus:border-red-400 bg-red-50/30'
        : 'border-gray-100 focus:border-[#0315ff] focus:bg-white bg-gray-50/50'
    }`;

const textareaClass = (error) =>
    `w-full px-4 py-3 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-300 
    focus:outline-none transition-all duration-200 resize-none
    ${error
        ? 'border-red-300 focus:border-red-400 bg-red-50/30'
        : 'border-gray-100 focus:border-[#0315ff] focus:bg-white bg-gray-50/50'
    }`;


// ── Écran de succès avec bouton d'impression ────────────────────────────────────────
function SuccessScreen({ numeroCommande }) {
    const handlePrintReceipt = () => {
        // Ouvrir le PDF dans un nouvel onglet
        window.open(`/commande/${numeroCommande}/recu`, '_blank');
    };
    
    return (
        <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-2">
                    Commande confirmée !
                </h2>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Votre commande a été enregistrée avec succès. Notez bien votre numéro de référence :
                </p>

                {/* Numéro de commande mis en évidence */}
                <div className="bg-[#0315ff]/5 border-2 border-[#0315ff]/20 rounded-2xl px-6 py-5 mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0315ff] mb-2">
                        Votre numéro de commande
                    </p>
                    <p className="text-3xl font-black text-black tracking-widest font-mono">
                        {numeroCommande}
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-left">
                    <div className="flex items-start gap-3">
                        <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 leading-relaxed">
                            <strong>Conservez ce numéro</strong> — il vous sera indispensable pour suivre
                            votre commande ou effectuer toute modification. Notre équipe vous contactera
                            sous 4 à 24h pour confirmer votre commande.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Bouton Imprimer le reçu */}
                    <button
                        onClick={handlePrintReceipt}
                        className="flex items-center justify-center gap-2 w-full bg-[#0315ff] text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all"
                    >
                        <FileText size={15} />
                        IMPRIMER LE REÇU
                    </button>
                    
                    <Link
                        href={route('shop.catalogue')}
                        className="flex items-center justify-center gap-2 w-full border-2 border-gray-100 text-gray-600 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:border-black hover:text-black transition-all"
                    >
                        <ShoppingBag size={15} />
                        CONTINUER MES ACHATS
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── Spinner d'attente avec timeout automatique ──────────────────────────────────────
function SpinnerOverlay({ onTimeout }) {
    useEffect(() => {
        // Timeout de sécurité : 10 secondes max
        const timer = setTimeout(() => {
            if (onTimeout) onTimeout();
        }, 10000);
        
        return () => clearTimeout(timer);
    }, [onTimeout]);
    
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[90] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-[#0315ff] animate-spin" />
            </div>
            <div className="text-center">
                <p className="text-base font-black uppercase tracking-[0.3em] text-black">
                    Traitement en cours
                </p>
                <p className="text-sm text-gray-400 mt-1 italic">Patientez...</p>
            </div>
        </div>
    );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function Checkout() {
    const { panier, flash } = usePage().props;
    const items = panier ? Object.values(panier) : [];

    const total = items.reduce(
        (acc, item) => acc + Number(item.prix) * Number(item.quantite),
        0
    );

    // Mode de saisie adresse : 'adresse' ou 'maps'
    const [adresseMode, setAdresseMode] = useState('adresse');

    // Spinner
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Numéro de commande reçu après succès
    const [commandeConfirmee, setCommandeConfirmee] = useState(
        flash?.commande_confirmee || null
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        nom_complet: '',
        telephone: '',
        adresse_livraison: '',
        google_maps_url: '',
        emplacement_supplementaire: '',
        email: '',
        note_importante: '',
    });

    // Réinitialise les champs selon le mode d'adresse
    const switchMode = (mode) => {
        setAdresseMode(mode);
        if (mode === 'adresse') {
            setData('google_maps_url', '');
        } else {
            setData('adresse_livraison', '');
        }
    };

    // Capte le flash de succès après redirection
    useEffect(() => {
        if (flash?.commande_confirmee) {
            setCommandeConfirmee(flash.commande_confirmee);
            setIsSubmitting(false);
        }
    }, [flash]);

    // Timeout de sécurité pour forcer la disparition du spinner
    useEffect(() => {
        let timeoutId;
        if (isSubmitting) {
            timeoutId = setTimeout(() => {
                console.warn('Spinner timeout - forcing close after 8 seconds');
                setIsSubmitting(false);
            }, 8000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isSubmitting]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Activer le spinner
        setIsSubmitting(true);

        // Soumettre directement sans délai artificiel
        post(route('commande.store'), {
            onSuccess: () => {
                // Le spinner sera désactivé par l'effet flash
                console.log('Commande créée avec succès');
            },
            onError: (errors) => {
                console.error('Erreur lors de la création de la commande:', errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                // Backup : désactiver le spinner après 3 secondes maximum
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 3000);
            },
        });
    };

    // Si commande confirmée → afficher écran de succès
    if (commandeConfirmee) {
        return (
            <FrontLayout>
                <Head title="Commande confirmée — Click'n'Buy" />
                <SuccessScreen numeroCommande={commandeConfirmee.numero} />
            </FrontLayout>
        );
    }

    // Panier vide
    if (items.length === 0) {
        return (
            <FrontLayout>
                <Head title="Checkout — Click'n'Buy" />
                <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <ShoppingBag size={48} className="text-gray-200 mx-auto mb-6" />
                        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-3">
                            Panier vide
                        </h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Vous n'avez aucun article dans votre panier.
                        </p>
                        <Link
                            href={route('shop.catalogue')}
                            className="inline-block bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#0315ff] transition-all"
                        >
                            Voir le catalogue
                        </Link>
                    </div>
                </div>
            </FrontLayout>
        );
    }

    return (
        <FrontLayout>
            <Head title="Checkout — Click'n'Buy" />

            {/* Spinner overlay */}
            {isSubmitting && <SpinnerOverlay onTimeout={() => setIsSubmitting(false)} />}

            {/* Hero titre — inspiré du design de référence */}
            <div className="relative bg-[#f8f8f8] border-b border-gray-100 overflow-hidden">
                {/* Lignes décoratives style référence */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            #000 0px, #000 1px,
                            transparent 1px, transparent 60px
                        )`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-[0.2em] text-black">
                        Checkout
                    </h1>
                    {/* Fil d'Ariane */}
                    <div className="flex items-center justify-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
                        <ChevronRight size={12} />
                        <Link href={route('panier.index')} className="hover:text-black transition-colors">Panier</Link>
                        <ChevronRight size={12} />
                        <span className="text-black">Checkout</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#f9f9f9] min-h-screen py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Erreur globale */}
                    {errors.error && (
                        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
                            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 font-medium">{errors.error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* ── COLONNE GAUCHE : Formulaire ── */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                                    <h2 className="text-lg font-black uppercase tracking-widest text-black mb-8 pb-4 border-b border-gray-100">
                                        Informations de livraison
                                    </h2>

                                    <div className="space-y-6">

                                        {/* Nom complet */}
                                        <Field label="Nom complet" required error={errors.nom_complet}>
                                            <input
                                                type="text"
                                                placeholder="Ex: Mohammed Alami"
                                                value={data.nom_complet}
                                                onChange={(e) => setData('nom_complet', e.target.value)}
                                                className={inputClass(errors.nom_complet)}
                                            />
                                        </Field>

                                        {/* Téléphone */}
                                        <Field
                                            label="Numéro de téléphone"
                                            required
                                            hint="Format marocain"
                                            error={errors.telephone}
                                        >
                                            <div className="relative">
                                                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="tel"
                                                    placeholder="+212 6X XXX XX XX"
                                                    value={data.telephone}
                                                    onChange={(e) => setData('telephone', e.target.value)}
                                                    className={`${inputClass(errors.telephone)} pl-10`}
                                                />
                                            </div>
                                        </Field>

                                        {/* Sélecteur Adresse OU Google Maps */}
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.15em] text-gray-700 mb-3">
                                                Adresse de livraison
                                                <span className="text-[#0315ff] ml-1">*</span>
                                            </p>

                                            {/* Toggle */}
                                            <div className="flex rounded-xl border-2 border-gray-100 overflow-hidden mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('adresse')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                                        adresseMode === 'adresse'
                                                            ? 'bg-black text-white'
                                                            : 'bg-white text-gray-400 hover:text-gray-600'
                                                    }`}
                                                >
                                                    <MapPin size={14} />
                                                    Saisir l'adresse
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('maps')}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                                                        adresseMode === 'maps'
                                                            ? 'bg-black text-white'
                                                            : 'bg-white text-gray-400 hover:text-gray-600'
                                                    }`}
                                                >
                                                    <Link2 size={14} />
                                                    Lien Google Maps
                                                </button>
                                            </div>

                                            {/* Champ adresse */}
                                            {adresseMode === 'adresse' ? (
                                                <Field error={errors.adresse_livraison}>
                                                    <input
                                                        type="text"
                                                        placeholder="Rue, quartier, ville..."
                                                        value={data.adresse_livraison}
                                                        onChange={(e) => setData('adresse_livraison', e.target.value)}
                                                        className={inputClass(errors.adresse_livraison)}
                                                    />
                                                </Field>
                                            ) : (
                                                <Field error={errors.google_maps_url}>
                                                    <div className="relative">
                                                        <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                        <input
                                                            type="url"
                                                            placeholder="https://maps.google.com/..."
                                                            value={data.google_maps_url}
                                                            onChange={(e) => setData('google_maps_url', e.target.value)}
                                                            className={`${inputClass(errors.google_maps_url)} pl-10`}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                                        <Info size={11} />
                                                        Partagez votre position depuis Google Maps pour une livraison précise
                                                    </p>
                                                </Field>
                                            )}
                                        </div>

                                        {/* Emplacement supplémentaire */}
                                        <Field
                                            label="Emplacement supplémentaire"
                                            hint="Facultatif"
                                            error={errors.emplacement_supplementaire}
                                        >
                                            <textarea
                                                rows={2}
                                                placeholder="Ex: Derrière la pharmacie Al Wifak, immeuble vert..."
                                                value={data.emplacement_supplementaire}
                                                onChange={(e) => setData('emplacement_supplementaire', e.target.value)}
                                                className={textareaClass(errors.emplacement_supplementaire)}
                                            />
                                        </Field>

                                        {/* Email */}
                                        <Field
                                            label="Email"
                                            hint="Facultatif"
                                            error={errors.email}
                                        >
                                            <div className="relative">
                                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`${inputClass(errors.email)} pl-10`}
                                                />
                                            </div>
                                        </Field>

                                        {/* Note importante */}
                                        <Field
                                            label="Note importante"
                                            hint="Facultatif"
                                            error={errors.note_importante}
                                        >
                                            <div className="relative">
                                                <MessageSquare size={15} className="absolute left-4 top-3.5 text-gray-300" />
                                                <textarea
                                                    rows={3}
                                                    placeholder="Ex: Appelez-moi 30 min avant la livraison, livrer après 18h..."
                                                    value={data.note_importante}
                                                    onChange={(e) => setData('note_importante', e.target.value)}
                                                    className={`${textareaClass(errors.note_importante)} pl-10`}
                                                />
                                            </div>
                                        </Field>

                                    </div>
                                </div>
                            </div>

                            {/* ── COLONNE DROITE : Résumé commande ── */}
                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sticky top-28">

                                    <h2 className="text-base font-black uppercase tracking-widest text-black mb-1">
                                        Votre commande
                                    </h2>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">
                                        Récapitulatif
                                    </p>

                                    {/* En-tête tableau */}
                                    <div className="grid grid-cols-2 border-b border-gray-100 pb-3 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Produit</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Total</span>
                                    </div>

                                    {/* Articles */}
                                    <div className="space-y-4 mb-6">
                                        {items.map((item) => (
                                            <div key={item.cart_key} className="grid grid-cols-2 items-start gap-2">
                                                <div className="flex items-start gap-3">
                                                    {item.image && (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.libelle}
                                                            className="w-10 h-12 object-cover rounded-lg shrink-0 border border-gray-100"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 leading-tight">
                                                            {item.libelle}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {item.taille} / {item.couleur}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">
                                                            × {item.quantite}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 text-right">
                                                    {(item.prix * item.quantite).toFixed(2)} DH
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totaux */}
                                    <div className="border-t border-gray-100 pt-4 space-y-3">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="font-bold uppercase tracking-widest">Sous-total</span>
                                            <span className="font-bold text-gray-900">{total.toFixed(2)} DH</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span className="font-bold uppercase tracking-widest">Livraison</span>
                                            <span className="font-bold text-green-600 uppercase">Gratuite</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="text-xs font-black uppercase tracking-widest text-black">Total</span>
                                            <span className="text-2xl font-black text-black">
                                                {total.toFixed(2)} <span className="text-sm">DH</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mode de paiement */}
                                    <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                            Mode de paiement
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#0315ff]" />
                                            <span className="text-xs font-bold text-gray-800">
                                                Paiement à la livraison (PAL)
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                                            Vous réglez en espèces (MAD) au livreur lors de la réception de votre colis.
                                        </p>
                                    </div>

                                    {/* Bouton confirmer */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || processing}
                                        className="mt-6 w-full bg-[#0315ff] text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            'Confirmer la commande'
                                        )}
                                    </button>

                                    {/* Indicateur sécurité */}
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                            Transaction sécurisée
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </FrontLayout>
    );
}