import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import SidebarFilters from '@/Components/Frontend/SidebarFilters';
import ProductCard from '@/Components/Frontend/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Composant de pagination
function Pagination({ produits }) {
    const { current_page, last_page, next_page_url, prev_page_url, links } = produits;

    if (last_page <= 1) return null;

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    // Filtre les liens Laravel pour ne garder que les numéros de pages (pas "Précédent"/"Suivant")
    const pageLinks = links.filter(
        (link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
    );

    // Sur mobile on n'affiche que les 3 pages autour de la page courante
    const visibleLinks = pageLinks.filter((link) => {
        const page = Number(link.label);
        return (
            page === 1 ||
            page === last_page ||
            Math.abs(page - current_page) <= 1
        );
    });

    return (
        <div className="mt-16 flex flex-col items-center gap-4">

            {/* Compteur */}
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                Page {current_page} sur {last_page}
            </p>

            {/* Contrôles */}
            <div className="flex items-center gap-2">

                {/* Précédent */}
                <button
                    onClick={() => goToPage(prev_page_url)}
                    disabled={!prev_page_url}
                    aria-label="Page précédente"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Numéros de pages — version mobile (compacte) */}
                <div className="flex sm:hidden items-center gap-1.5">
                    {visibleLinks.map((link, i) => {
                        const page = Number(link.label);
                        const prevPage = Number(visibleLinks[i - 1]?.label);
                        const showEllipsis = i > 0 && page - prevPage > 1;
                        return (
                            <React.Fragment key={link.label}>
                                {showEllipsis && (
                                    <span className="text-xs text-gray-300 font-bold px-1">…</span>
                                )}
                                <button
                                    onClick={() => goToPage(link.url)}
                                    disabled={link.active}
                                    className={`w-9 h-9 rounded-full text-xs font-black transition-all ${
                                        link.active
                                            ? 'bg-[#0315ff] text-white cursor-default'
                                            : 'border-2 border-gray-100 text-gray-600 hover:border-black'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Numéros de pages — version desktop (tous les numéros) */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {pageLinks.map((link, i) => {
                        const page = Number(link.label);
                        const prevPage = Number(pageLinks[i - 1]?.label);
                        const showEllipsis = i > 0 && page - prevPage > 1;
                        return (
                            <React.Fragment key={link.label}>
                                {showEllipsis && (
                                    <span className="text-xs text-gray-300 font-bold px-1">…</span>
                                )}
                                <button
                                    onClick={() => goToPage(link.url)}
                                    disabled={link.active}
                                    className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                                        link.active
                                            ? 'bg-[#0315ff] text-white cursor-default'
                                            : 'border-2 border-gray-100 text-gray-600 hover:border-black hover:border-2'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Suivant */}
                <button
                    onClick={() => goToPage(next_page_url)}
                    disabled={!next_page_url}
                    aria-label="Page suivante"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

export default function Catalogue({ auth, produits, categories, availableColors }) {
    // Avec la pagination Laravel, les produits sont dans produits.data
    const listeProduits = produits.data || [];

    return (
        <FrontLayout auth={auth}>
            <Head title="Catalogue - Click'n'Buy" />

            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-12">

                {/* Sidebar filtres */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <SidebarFilters
                        categories={categories}
                        availableColors={availableColors}
                    />
                </div>

                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                    {/* En-tête résultats */}
                    <div className="flex justify-between items-center mb-10 border-b pb-5">
                        <h2 className="text-xl font-bold uppercase tracking-widest italic">
                            Collection
                        </h2>
                        <span className="text-xs font-bold text-gray-400 uppercase">
                            {produits.total} Article{produits.total > 1 ? 's' : ''}
                        </span>
                    </div>

                    {listeProduits.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                                {listeProduits.map((produit) => (
                                    <ProductCard key={produit.id} produit={produit} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination produits={produits} />
                        </>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-lg">
                            <p className="text-gray-400 italic font-medium">
                                Aucun produit ne correspond à vos critères.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </FrontLayout>
    );
}