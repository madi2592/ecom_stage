import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "@inertiajs/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroSlider({ sliders }) {
    if (!sliders || sliders.length === 0) return null;

    return (
        <section className="relative w-full bg-[#f5f7fa] border-b overflow-hidden">
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect="fade"
                slidesPerView={1}
                pagination={{ clickable: true, el: ".swiper-pagination-hero" }}
                autoplay={{ delay: 6000 }}
                loop={true}
                className="h-auto"
            >
                {sliders.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {/* GRILLE STRICTE : 1 colonne mobile, 2 colonnes desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                            {/* IMAGE : En haut sur mobile, À droite sur desktop
                                - object-contain garantit que l'image entière est visible
                                - hauteur mobile basée sur vw pour rester proportionnelle à l'image
                                - padding pour que l'image ne touche pas les bords */}
                            <div className="h-[55vw] sm:h-[48vw] md:h-[38vw] lg:h-[36vw] md:order-2 bg-[#f5f7fa] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
                                <img
                                    src={slide.image_url}
                                    alt={slide.titre}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* TEXTE : En bas sur mobile, À gauche sur desktop */}
                            <div className="flex items-center p-8 sm:p-12 md:p-16 lg:p-24 md:order-1 bg-[#f5f7fa]">
                                <div className="w-full text-center md:text-left">
                                    <p className="text-[10px] font-bold uppercase text-[#0315ff] tracking-[0.4em] mb-4">
                                        {slide.sous_titre || "Collection 2026"}
                                    </p>

                                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter italic leading-[0.9] mb-6">
                                        {slide.titre}
                                    </h1>

                                    <p className="text-sm md:text-base text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
                                        {slide.description ||
                                            "Découvrez l'élégance absolue à travers notre nouvelle sélection."}
                                    </p>

                                    <div className="flex justify-center md:justify-start">
                                        <Link
                                            href={route("shop.catalogue")}
                                            className="bg-black text-white px-10 py-4 md:px-12 md:py-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#0315ff] transition-colors"
                                        >
                                            Voir la Collection
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination positionnée proprement */}
            <div className="swiper-pagination-hero absolute bottom-6 left-1/2 md:left-24 -translate-x-1/2 md:translate-x-0 z-20"></div>
        </section>
    );
}
