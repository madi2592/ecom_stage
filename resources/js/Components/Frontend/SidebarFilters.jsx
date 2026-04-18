import React from 'react';
import { router, usePage } from '@inertiajs/react';

export default function SidebarFilters({ categories, availableColors }) {
    const { filters } = usePage().props;

    // Dictionnaire pour convertir les noms de la DB en couleurs CSS valides
    const colorMap = {
        'Bleu': '#0000FF',
        'Rouge': '#FF0000',
        'Vert': '#008000',
        'Noir': '#000000',
        'Blanc': '#FFFFFF',
        'Jaune': '#FFFF00',
        'Rose': '#FFC0CB',
        'Gris': '#808080',
        'Marron': '#8B4513',
        'Beige': '#F5F5DC',
        'Orange': '#FFA500',
        'Violet': '#800080',
        'Marine': '#000080',
        'Ciel': '#87CEEB'
    };
    
    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        router.get(route('shop.catalogue'), newFilters, { preserveState: true });
    };

    const resetFilters = () => {
        router.get(route('shop.catalogue'), {});
    };

    return (
        <div className="space-y-10">
            {/* Catégories */}
            <div className="widget">
                <h6 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b pb-2">Catégories</h6>
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button 
                                onClick={() => handleFilter('categorie', cat.slug)}
                                className={`text-sm transition-colors text-left w-full ${
                                    filters.categorie === cat.slug 
                                    ? 'text-[#0315ff] font-bold' 
                                    : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                {cat.nom} ({cat.produits_count})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Couleurs Dynamiques */}
            {availableColors?.length > 0 && (
                <div className="widget">
                    <h6 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b pb-2">Couleurs</h6>
                    <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => {
                            // On cherche dans le dictionnaire, sinon on utilise la valeur brute
                            const hexColor = colorMap[color] || color.toLowerCase();
                            
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleFilter('color', color)}
                                    className={`w-7 h-7 rounded-full border transition-all duration-200 hover:scale-110 ${
                                        filters.color === color 
                                        ? 'border-black ring-2 ring-offset-2 ring-gray-300 scale-110' 
                                        : 'border-gray-200'
                                    }`}
                                    style={{ backgroundColor: hexColor }}
                                    title={color}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <button 
                    onClick={resetFilters}
                    className="w-full bg-gray-100 text-gray-600 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors"
                >
                    Réinitialiser les filtres
                </button>
            </div>
        </div>
    );
}