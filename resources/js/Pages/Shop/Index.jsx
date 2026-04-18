import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '@/Layouts/FrontLayout';
import HeroSlider from '@/Components/Frontend/HeroSlider';
import ProductCard from '@/Components/Frontend/ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Nombre de cards visibles selon la largeur de l'écran
function getCardsVisible(width) {
    if (width < 480) return 1;   // Mobile portrait  → 1 card pleine largeur
    if (width < 768) return 2;   // Mobile paysage / petite tablette → 2 cards
    if (width < 1024) return 3;  // Tablette → 3 cards
    return 4;                    // Desktop → 4 cards
}

export default function Index({ auth, produits, sliders }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsVisible, setCardsVisible] = useState(4);
    const [cardWidth, setCardWidth] = useState(0);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const GAP = 24; // gap-6 = 24px

    // Recalcule la largeur d'une card selon le conteneur réel
    const recalculate = useCallback(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const visible = getCardsVisible(window.innerWidth);
        const computed = (containerWidth - GAP * (visible - 1)) / visible;
        setCardsVisible(visible);
        setCardWidth(computed);
        // Ramène l'index dans les bornes si on réduit l'écran
        setCurrentIndex((idx) =>
            Math.min(idx, Math.max(0, produits.length - visible))
        );
    }, [produits.length]);

    useEffect(() => {
        recalculate();
        const observer = new ResizeObserver(recalculate);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [recalculate]);

    const totalSlides = Math.max(0, produits.length - cardsVisible);
    const canPrev = currentIndex > 0;
    const canNext = currentIndex < totalSlides;

    const prev = () => { if (canPrev) setCurrentIndex((i) => i - 1); };
    const next = () => { if (canNext) setCurrentIndex((i) => i + 1); };

    // Déplacement en pixels — précis quel que soit le breakpoint
    const offset = currentIndex * (cardWidth + GAP);

    // Gestion du swipe tactile
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        touchStartX.current = null;
    };

    return (
        <FrontLayout auth={auth}>
            <Head title="Click'n'Buy — Mode & Tendances" />

            {/* 1. Hero Section */}
            <HeroSlider sliders={sliders} />

            {/* 2. Section Nouveautés */}
            <section className="py-14 sm:py-20 bg-white">
                <div
                    ref={containerRef}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                >
                    {/* En-tête de section */}
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0315ff] mb-2">
                                Collection 2026
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-black leading-none">
                                New Arrivals
                            </h2>
                        </div>

                        {/* Flèches — visibles sur sm et plus */}
                        <div className="hidden sm:flex items-center gap-3">
                            <button
                                onClick={prev}
                                disabled={!canPrev}
                                aria-label="Précédent"
                                className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <button
                                onClick={next}
                                disabled={!canNext}
                                aria-label="Suivant"
                                className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Carousel — fenêtre glissante en pixels */}
                    <div
                        className="overflow-hidden"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                gap: `${GAP}px`,
                                transform: cardWidth > 0 ? `translateX(-${offset}px)` : 'none',
                            }}
                        >
                            {produits.map((produit) => (
                                <div
                                    key={produit.id}
                                    className="flex-shrink-0"
                                    style={{
                                        width: cardWidth > 0 ? `${cardWidth}px` : '25%',
                                    }}
                                >
                                    <ProductCard produit={produit} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contrôles bas : dots + flèches mobile */}
                    <div className="mt-8 flex flex-col items-center gap-5">

                        {/* Dots cliquables */}
                        {totalSlides > 0 && (
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalSlides + 1 }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        aria-label={`Groupe ${i + 1}`}
                                        className={`transition-all duration-300 rounded-full ${
                                            currentIndex === i
                                                ? 'w-7 h-2 bg-[#0315ff]'
                                                : 'w-2 h-2 bg-gray-200 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Flèches + compteur — uniquement mobile */}
                        <div className="flex sm:hidden items-center gap-5">
                            <button
                                onClick={prev}
                                disabled={!canPrev}
                                aria-label="Précédent"
                                className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all disabled:border-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed active:bg-black active:text-white"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest min-w-[48px] text-center">
                                {currentIndex + 1} / {totalSlides + 1}
                            </span>
                            <button
                                onClick={next}
                                disabled={!canNext}
                                aria-label="Suivant"
                                className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center transition-all disabled:border-gray-200 disabled:text-gray-200 disabled:cursor-not-allowed active:bg-black active:text-white"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* CTA — pleine largeur sur mobile, auto sur desktop */}
                    <div className="flex justify-center mt-12 sm:mt-16">
                        <Link
                            href={route('shop.catalogue')}
                            className="group inline-flex items-center justify-center gap-4 bg-black text-white w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#0315ff] transition-all duration-300"
                        >
                            Découvrir le catalogue
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </FrontLayout>
    );
}