import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { Head, useForm, router } from '@inertiajs/react';
import { ImagePlay, Trash2, Plus } from 'lucide-react';

export default function Index({ auth, sliders }) {
    const [deleteDialog, setDeleteDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        titre: '',
        sous_titre: '',
        image: null,
        ordre: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.sliders.store'), {
            onSuccess: () => reset(),
        });
    };

    const confirmDelete = () => {
        if (!deleteDialog) return;
        // ✅ Route corrigée : admin.sliders.destroy (groupe admin.)
        router.delete(route('admin.sliders.destroy', deleteDialog), {
            onFinish: () => setDeleteDialog(false),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <ImagePlay size={20} className="text-indigo-500" />
                    Gestion Hero Slider
                </h2>
            }
        >
            <Head title="Gestion Hero Slider" />

            <div className="space-y-8">

                {/* Formulaire d'ajout */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h2 className="text-lg font-bold mb-6 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                        <Plus size={18} className="text-indigo-500" />
                        Ajouter un nouveau Slide
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Titre</label>
                            <input
                                type="text"
                                value={data.titre}
                                onChange={(e) => setData('titre', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sous-titre (Optionnel)</label>
                            <input
                                type="text"
                                value={data.sous_titre}
                                onChange={(e) => setData('sous_titre', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image du Hero</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ordre d'affichage</label>
                            <input
                                type="number"
                                value={data.ordre}
                                onChange={(e) => setData('ordre', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Plus size={16} />
                                {processing ? 'Enregistrement...' : 'Enregistrer le Slide'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Liste des slides */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h2 className="text-lg font-bold mb-6 uppercase tracking-widest border-b pb-2">
                        Slides Actuels ({sliders.length})
                    </h2>

                    {sliders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sliders.map((slider) => (
                                <div key={slider.id} className="border rounded-xl overflow-hidden group relative shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-40 overflow-hidden bg-gray-100">
                                        <img
                                            src={slider.image_url}
                                            alt={slider.titre}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-sm uppercase truncate">{slider.titre}</p>
                                        {slider.sous_titre && (
                                            <p className="text-xs text-gray-400 italic mt-0.5 truncate">{slider.sous_titre}</p>
                                        )}
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Ordre : {slider.ordre}
                                            </span>
                                            {/* ✅ Suppression via ConfirmDialog */}
                                            <button
                                                onClick={() => setDeleteDialog(slider.id)}
                                                className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest transition-colors"
                                            >
                                                <Trash2 size={14} /> Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl">
                            <ImagePlay size={40} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 italic text-sm">Aucun slide configuré pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ConfirmDialog — même pattern que le reste du projet */}
            <ConfirmDialog
                show={Boolean(deleteDialog)}
                title="Supprimer ce slide ?"
                message="Ce slide sera supprimé définitivement de votre Hero Section."
                confirmText="Oui, supprimer"
                onClose={() => setDeleteDialog(false)}
                onConfirm={confirmDelete}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}