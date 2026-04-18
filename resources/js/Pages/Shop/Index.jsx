import React from 'react';
import { Head } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout'; 
import HeroSlider from '@/Components/Frontend/HeroSlider';
import ProductCard from '@/Components/Frontend/ProductCard';

export default function Index({ auth, produits, sliders }) {
    return (
        <FrontLayout auth={auth}>
            <Head title="Essence - Fashion eCommerce" />

            {/* 1. Hero Section - Full Width */}
            <HeroSlider sliders={sliders} />

            {/* 2. Section Nouveautés (Similaire à l'index de la démo) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black uppercase tracking-widest italic">New Arrivals</h2>
                </div>

                {/* Grille pleine largeur sans sidebar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {produits.map((produit) => (
                        <ProductCard key={produit.id} produit={produit} />
                    ))}
                </div>
            </div>
        </FrontLayout>
    );
}