import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductCard({ produit }) {
    const [isHovered, setIsHovered] = useState(false);

    // 1. Badge de réduction (Calcul sécurisé)
    const discount = (produit.prix_promo && produit.prix > 0)
        ? `-${Math.round(((produit.prix - produit.prix_promo) / produit.prix) * 100)}%`
        : null;

    // 2. Badge "New"
    const isNew = () => {
        if (!produit.created_at) return false;
        const diff = (new Date() - new Date(produit.created_at)) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    };
    // Au pire, on prend la première image du tableau.
    const images = produit.images || [];
    const primaryImg = images.find(img => img.is_main || img.est_principale) || images[0];
    const hoverImg = images.length > 1 ? images[1] : primaryImg;
    const currentImg = isHovered ? hoverImg : primaryImg;

    // 4. Construction de l'URL (Plus robuste)
    const getImagePath = (img) => {
        if (!img?.chemin) return '/images/placeholder.jpg';
        return `/storage/${img.chemin}`;
    };

    return (
        <div className="group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="relative aspect-[3/4] bg-[#f5f7fa] overflow-hidden">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {discount && (
                        <span className="bg-[#0315ff] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            {discount}
                        </span>
                    )}
                    {isNew() && (
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            New
                        </span>
                    )}
                </div>

                <Link href={route('shop.show', produit.slug || produit.id)}>
                    <img 
                        src={getImagePath(currentImg)}
                        alt={produit.libelle}
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                    />
                </Link>
                
                {/* Bouton Quick Add (Typique Essence) */}
                <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#0315ff]">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="py-6 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                    {produit.categorie?.nom || 'Collection'}
                </p>
                <Link href={route('shop.show', produit.slug || produit.id)}>
                    <h3 className="text-black font-medium hover:text-[#0315ff] transition-colors uppercase text-sm tracking-wide">
                        {produit.libelle}
                    </h3>
                </Link>
                <div className="mt-2 flex justify-center gap-2 text-sm">
                    {produit.prix_promo ? (
                        <>
                            <span className="text-amber-500 line-through">{produit.prix} DH</span>
                            <span className="text-[#0315ff] font-bold">{produit.prix_promo} DH</span>
                        </>
                    ) : (
                        <span className="text-black font-bold">{produit.prix} DH</span>
                    )}
                </div>
            </div>
        </div>
    );
}