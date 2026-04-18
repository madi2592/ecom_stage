import ApplicationLogo from '@/Components/ApplicationLogo';
import FlashAlert from '@/Components/FlashAlert';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Package,
    Tags,
    Ruler,
    UserCircle,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ChevronDown,
    Layers,
    Bell,
    Monitor,
    ImagePlay,
    Megaphone,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash = {} } = usePage().props;
    const user = auth.user;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [alerts, setAlerts] = useState([]);

    const [isCatalogueOpen, setIsCatalogueOpen] = useState(
        route().current('admin.categories.*') || route().current('admin.guides-tailles.*')
    );

    // ── Nouveau state pour le dropdown Front-Office ──
    const [isFrontOfficeOpen, setIsFrontOfficeOpen] = useState(
        route().current('admin.sliders.*')
    );

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const nextAlerts = Object.entries(flash)
            .filter(([, message]) => Boolean(message))
            .map(([type, message]) => ({
                id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type,
                message,
            }));

        if (nextAlerts.length) {
            setAlerts((currentAlerts) => [...currentAlerts, ...nextAlerts]);
        }
    }, [flash]);

    const dismissAlert = (id) => {
        setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <FlashAlert alerts={alerts} onDismiss={dismissAlert} />

            {/* --- SIDEBAR --- */}
            <aside
                className={`${
                    isSidebarOpen ? 'w-72' : 'w-20'
                } bg-[#1e293b] text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl`}
            >
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700/50">
                    <Link href="/" className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-indigo-500 p-2 rounded-lg shrink-0">
                            <ApplicationLogo className="block h-6 w-auto fill-current text-white" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-extrabold text-xl tracking-tight text-white">
                                Click'n'Buy<span className="text-indigo-400">Manager</span>
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <SidebarLink
                        href={route('dashboard')}
                        icon={<LayoutDashboard size={20} />}
                        label="Tableau de bord"
                        active={route().current('dashboard')}
                        isOpen={isSidebarOpen}
                    />

                    {/* ── Section Gestion Stock ── */}
                    {isSidebarOpen && (
                        <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Gestion Stock
                        </p>
                    )}

                    <SidebarLink
                        href={route('admin.produits.index')}
                        icon={<Package size={20} />}
                        label="Produits"
                        active={route().current('admin.produits.*')}
                        isOpen={isSidebarOpen}
                    />

                    {/* Catalogue (Catégories + Guides) */}
                    <div className="space-y-1">
                        <button
                            onClick={() =>
                                isSidebarOpen
                                    ? setIsCatalogueOpen(!isCatalogueOpen)
                                    : setIsSidebarOpen(true)
                            }
                            className={`w-full flex items-center p-3 rounded-xl transition-all group ${
                                route().current('admin.categories.*') ||
                                route().current('admin.guides-tailles.*')
                                    ? 'bg-slate-700/50 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Layers size={20} className={isCatalogueOpen ? 'text-indigo-400' : ''} />
                            {isSidebarOpen && (
                                <>
                                    <span className="ml-3 font-medium flex-1 text-left">Catalogue</span>
                                    {isCatalogueOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </>
                            )}
                        </button>

                        {isSidebarOpen && isCatalogueOpen && (
                            <div className="ml-4 pl-6 border-l border-slate-700 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                <SidebarSubLink
                                    href={route('admin.categories.index')}
                                    label="Catégories"
                                    active={route().current('admin.categories.*')}
                                    icon={<Tags size={16} />}
                                />
                                <SidebarSubLink
                                    href={route('admin.guides-tailles.index')}
                                    label="Guides Tailles"
                                    active={route().current('admin.guides-tailles.*')}
                                    icon={<Ruler size={16} />}
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Section Front-Office ── */}
                    {isSidebarOpen && (
                        <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Front-Office
                        </p>
                    )}

                    {/* Dropdown Front-Office */}
                    <div className="space-y-1">
                        <button
                            onClick={() =>
                                isSidebarOpen
                                    ? setIsFrontOfficeOpen(!isFrontOfficeOpen)
                                    : setIsSidebarOpen(true)
                            }
                            className={`w-full flex items-center p-3 rounded-xl transition-all group ${
                                route().current('admin.sliders.*')
                                    ? 'bg-slate-700/50 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Monitor size={20} className={isFrontOfficeOpen ? 'text-indigo-400' : ''} />
                            {isSidebarOpen && (
                                <>
                                    <span className="ml-3 font-medium flex-1 text-left">Front-Office</span>
                                    {isFrontOfficeOpen
                                        ? <ChevronDown size={16} />
                                        : <ChevronRight size={16} />
                                    }
                                </>
                            )}
                        </button>

                        {isSidebarOpen && isFrontOfficeOpen && (
                            <div className="ml-4 pl-6 border-l border-slate-700 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                {/* Hero Section → admin.sliders.index */}
                                <SidebarSubLink
                                    href={route('admin.sliders.index')}
                                    label="Hero Section"
                                    active={route().current('admin.sliders.*')}
                                    icon={<ImagePlay size={16} />}
                                />
                                {/* Promo Section → réservée */}
                                <SidebarSubLinkDisabled
                                    label="Promo Section"
                                    icon={<Megaphone size={16} />}
                                />
                            </div>
                        )}
                    </div>
                </nav>

                <button
                    onClick={toggleSidebar}
                    className="m-4 p-3 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
                </button>
            </aside>

            {/* --- CONTENU PRINCIPAL --- */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'pl-72' : 'pl-20'}`}>

                {/* --- NAVBAR --- */}
                <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm px-8 h-20 flex items-center">
                    <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                        <div className="text-gray-800">{header}</div>

                        <div className="flex items-center gap-6">
                            <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Bell size={22} />
                            </button>

                            <div className="h-8 w-[1px] bg-gray-200"></div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 group focus:outline-none">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-tighter text-right leading-3">
                                                Administrateur
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm group-hover:bg-indigo-100 transition-all">
                                            {user.name.charAt(0)}
                                        </div>
                                        <ChevronDown size={14} className="text-gray-400 group-hover:text-indigo-600" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48" contentClasses="bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 sm:hidden">
                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">Administrateur</p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 py-3 hover:bg-indigo-50">
                                        <UserCircle size={16} className="text-indigo-500" /> Mon Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 py-3 text-red-600 font-bold hover:bg-red-50">
                                        <LogOut size={16} /> Déconnexion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// ── Sous-composants ─────────────────────────────────────────────────────────

function SidebarLink({ href, icon, label, active, isOpen }) {
    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-xl transition-all group ${
                active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
                {icon}
            </div>
            {isOpen && <span className="ml-3 font-medium flex-1 truncate">{label}</span>}
        </Link>
    );
}

function SidebarSubLink({ href, label, active, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors text-sm ${
                active ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-200'
            }`}
        >
            {icon}<span>{label}</span>
        </Link>
    );
}

// Sous-lien désactivé — pour "Promo Section" (à venir)
function SidebarSubLinkDisabled({ label, icon }) {
    return (
        <div
            className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-slate-600 cursor-not-allowed select-none"
            title="Disponible prochainement"
        >
            {icon}
            <span>{label}</span>
            <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                Soon
            </span>
        </div>
    );
}