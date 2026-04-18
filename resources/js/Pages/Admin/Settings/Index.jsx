import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Settings, FolderTree, Ruler, ChevronRight } from "lucide-react";

// Importation de tes composants de gestion (à adapter selon tes noms de fichiers)
import CategoriesManager from "./Partials/CategoriesManager";
import GuidesManager from "./Partials/GuidesManager";

export default function Index({ auth, categories, guides }) {
    const [activeTab, setActiveTab] = useState("categories");

    const tabs = [
        {
            id: "categories",
            label: "Catégories",
            icon: FolderTree,
            description: "Structure du catalogue"
        },
        {
            id: "guides",
            label: "Guides des Tailles",
            icon: Ruler,
            description: "Mesures et référentiels"
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <Settings className="text-gray-400" size={20} />
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                        Configuration Système
                    </h2>
                </div>
            }
        >
            <Head title="Configuration" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* Barre latérale des onglets */}
                        <div className="lg:col-span-1 space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isActive
                                                ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100"
                                                : "bg-transparent border-transparent hover:bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 text-left">
                                            <div className={`p-2 rounded-lg ${isActive ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isActive ? "text-indigo-900" : "text-gray-700"}`}>
                                                    {tab.label}
                                                </p>
                                                <p className="text-[11px] opacity-70">{tab.description}</p>
                                            </div>
                                        </div>
                                        {isActive && <ChevronRight size={16} className="text-indigo-400" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Contenu de l'onglet actif */}
                        <div className="lg:col-span-3">
                            <div className="bg-white shadow-sm border border-gray-100 sm:rounded-xl overflow-hidden min-h-[600px]">
                                {activeTab === "categories" ? (
                                    <CategoriesManager categories={categories} />
                                ) : (
                                    <GuidesManager guides={guides} categories={categories} />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}