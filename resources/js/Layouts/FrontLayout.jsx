import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, X, User, ChevronDown, MessageCircle, MapPin } from 'lucide-react';

// Composants SVG Manuels pour éviter les erreurs d'export de bibliothèque
const FacebookIcon = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = (props) => (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function FrontLayout({ children }) {
    const { auth } = usePage().props;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileServiceOpen, setIsMobileServiceOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fermer le dropdown desktop si clic en dehors
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fermer le menu mobile au passage desktop
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
                setIsMobileServiceOpen(false);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-[#787878]">

            {/* Overlay (panier + menu mobile) */}
            {(isCartOpen || isMenuOpen) && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60]"
                    onClick={() => { setIsCartOpen(false); setIsMenuOpen(false); }}
                />
            )}

            {/* Cart Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-bold text-black uppercase tracking-widest">Panier</h2>
                        <button onClick={() => setIsCartOpen(false)}><X className="text-gray-400 hover:text-black" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto text-center py-20 italic text-gray-400">Votre panier est vide.</div>
                    <div className="border-t pt-6">
                        <div className="flex justify-between text-lg font-bold text-black mb-6"><span>TOTAL</span><span>0.00 DH</span></div>
                        <button className="w-full bg-[#0315ff] text-white py-4 font-bold uppercase tracking-widest hover:bg-black transition-colors">Commander</button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile Drawer (depuis la gauche) */}
            <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">

                    {/* En-tête drawer */}
                    <div className="flex justify-between items-center px-6 h-[85px] border-b border-gray-100 shrink-0">
                        <span className="text-2xl font-black tracking-tighter text-black">
                            Click'n'<span className="text-[#0315ff]">Buy</span>
                        </span>
                        <button onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu">
                            <X size={22} className="text-gray-400 hover:text-black transition-colors" />
                        </button>
                    </div>

                    {/* Liens nav mobile */}
                    <nav className="flex flex-col px-6 py-6 gap-0 overflow-y-auto flex-1">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="py-4 text-sm font-bold uppercase tracking-widest text-black hover:text-[#0315ff] border-b border-gray-100 transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            href={route('shop.catalogue')}
                            onClick={() => setIsMenuOpen(false)}
                            className="py-4 text-sm font-bold uppercase tracking-widest text-black hover:text-[#0315ff] border-b border-gray-100 transition-colors"
                        >
                            Catalogue
                        </Link>

                        {/* Libre Service — accordion mobile */}
                        <div className="border-b border-gray-100">
                            <button
                                onClick={() => setIsMobileServiceOpen(!isMobileServiceOpen)}
                                className="w-full flex items-center justify-between py-4 text-sm font-bold uppercase tracking-widest text-black hover:text-[#0315ff] transition-colors"
                            >
                                <span>Libre Service</span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${isMobileServiceOpen ? 'rotate-180 text-[#0315ff]' : ''}`}
                                />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${isMobileServiceOpen ? 'max-h-40 pb-3' : 'max-h-0'}`}>
                                <Link
                                    href="#"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 py-2 pl-4 text-sm text-gray-500 hover:text-[#0315ff] transition-colors"
                                >
                                    <MapPin size={15} className="shrink-0" />
                                    Suivre ma commande
                                </Link>
                                <a
                                    href="https://wa.me/212600000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 py-2 pl-4 text-sm text-gray-500 hover:text-[#25D366] transition-colors"
                                >
                                    <MessageCircle size={15} className="shrink-0" />
                                    Support WhatsApp
                                </a>
                            </div>
                        </div>

                        <Link
                            href="#"
                            onClick={() => setIsMenuOpen(false)}
                            className="py-4 text-sm font-bold uppercase tracking-widest text-black hover:text-[#0315ff] transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Bas du drawer — compte utilisateur */}
                    <div className="px-6 pb-8 pt-6 border-t border-gray-100 shrink-0">
                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black hover:text-[#0315ff] transition-colors"
                        >
                            <User size={18} />
                            {auth.user ? auth.user.name : 'Connexion'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── HEADER FIXE ── */}
            <header className="fixed top-0 left-0 right-0 w-full h-[85px] bg-white border-b border-gray-100 flex items-center z-50">
                <div className="flex w-full h-full">

                    {/* Logo */}
                    <div className="w-[180px] sm:w-[280px] flex items-center justify-center border-r border-gray-100 shrink-0">
                        <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tighter text-black">
                            Click'n'<span className="text-[#0315ff]">Buy</span>
                        </Link>
                    </div>

                    {/* Nav desktop */}
                    <nav className="hidden lg:flex flex-1 items-center px-10 gap-8 uppercase text-xs font-bold tracking-widest text-black">
                        <Link href="/" className="hover:text-[#0315ff] transition-colors">Accueil</Link>
                        <Link href={route('shop.catalogue')} className="hover:text-[#0315ff] transition-colors">Catalogue</Link>

                        {/* Dropdown Libre Service */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-1 transition-colors ${isDropdownOpen ? 'text-[#0315ff]' : 'hover:text-[#0315ff]'}`}
                            >
                                Libre Service
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Menu dropdown desktop */}
                            <div className={`absolute top-full left-0 mt-4 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top ${isDropdownOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
                                <Link
                                    href="#"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-5 py-4 text-xs font-bold tracking-widest text-gray-700 hover:bg-gray-50 hover:text-[#0315ff] transition-colors border-b border-gray-100"
                                >
                                    <MapPin size={15} className="shrink-0 text-gray-400" />
                                    Suivre ma commande
                                </Link>
                                <a
                                    href="https://wa.me/212600000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-5 py-4 text-xs font-bold tracking-widest text-gray-700 hover:bg-gray-50 hover:text-[#25D366] transition-colors"
                                >
                                    <MessageCircle size={15} className="shrink-0 text-gray-400" />
                                    Support WhatsApp
                                </a>
                            </div>
                        </div>

                        <Link href="#" className="hover:text-[#0315ff] transition-colors">Contact</Link>
                    </nav>

                    {/* Icônes droite */}
                    <div className="flex items-center px-4 sm:px-6 gap-4 sm:gap-5 ml-auto">
                        <button className="text-black hover:text-[#0315ff] transition-colors hidden sm:block">
                            <Search size={22} />
                        </button>
                        <Link
                            href={auth.user ? route('dashboard') : route('login')}
                            className="text-black hover:text-[#0315ff] transition-colors hidden sm:block"
                        >
                            <User size={22} />
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-black hover:text-[#0315ff] transition-colors"
                        >
                            <ShoppingBag size={22} />
                            <span className="absolute -top-2 -right-2 bg-[#0315ff] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </button>

                        {/* Hamburger — mobile/tablette uniquement */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden text-black hover:text-[#0315ff] transition-colors ml-1"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                </div>
            </header>

            {/* Spacer pour compenser le header fixe (évite que le contenu passe sous le header) */}
            <div className="h-[85px]" aria-hidden="true" />

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-[#171717] py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1">
                        <div className="text-3xl font-black text-white mb-6">Click'n'<span className="text-[#2834e3]">Buy</span></div>
                        <p className="text-gray-500 text-sm">Le meilleur de la mode au Maroc.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Boutique</h4>
                        <ul className="text-gray-500 text-sm space-y-3">
                            <li><Link href={route('shop.catalogue')} className="hover:text-white">Tous les produits</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 flex flex-col items-start">
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Suivez-nous</h4>
                        <div className="flex gap-4">
                            <FacebookIcon className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                            <InstagramIcon className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
                <div className="text-center mt-20 text-gray-600 text-[10px] uppercase tracking-widest">© 2026 Click'n'buy.</div>
            </footer>
        </div>
    );
}