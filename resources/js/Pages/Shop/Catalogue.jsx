import React from 'react';
import { Head } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import SidebarFilters from '@/Components/Frontend/SidebarFilters';
import ProductCard from '@/Components/Frontend/ProductCard';

export default function Catalogue({ auth, produits, categories, availableColors }) {
    // IMPORTANT : Avec la pagination, les produits sont dans produits.data
    const listeProduits = produits.data || [];

    return (
        <FrontLayout auth={auth}>
            <Head title="Catalogue - Essence" />

            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-12">
                
                {/* Sidebar avec données dynamiques */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <SidebarFilters 
                        categories={categories} 
                        availableColors={availableColors} 
                    />
                </div>

                {/* Grille */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-10 border-b pb-5">
                        <h2 className="text-xl font-bold uppercase tracking-widest italic">Collection</h2>
                        <span className="text-xs font-bold text-gray-400 uppercase">
                            {produits.total} Articles {/* .total vient de la pagination Laravel */}
                        </span>
                    </div>

                    {listeProduits.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {listeProduits.map((produit) => (
                                <ProductCard key={produit.id} produit={produit} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-lg">
                            <p className="text-gray-400 italic font-medium">Aucun produit ne correspond à vos critères.</p>
                        </div>
                    )}

                    {/* TODO: Ajouter ici tes liens de pagination si nécessaire (produits.links) */}
                </div>
            </div>
        </FrontLayout>
    );
}