import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, sliders }) {
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

    const handleDelete = (id) => {
        if (confirm('Supprimer ce slide ?')) {
            router.delete(route('sliders.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestion Hero Slider" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Formulaire d'ajout */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-widest border-b pb-2">Ajouter un nouveau Slide</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Titre</label>
                                <input type="text" value={data.titre} onChange={e => setData('titre', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black" />
                                {errors.titre && <div className="text-red-500 text-xs mt-1">{errors.titre}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sous-titre (Optionnel)</label>
                                <input type="text" value={data.sous_titre} onChange={e => setData('sous_titre', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image du Hero</label>
                                <input type="file" onChange={e => setData('image', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
                                {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ordre d'affichage</label>
                                <input type="number" value={data.ordre} onChange={e => setData('ordre', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </div>

                            <div className="md:col-span-2">
                                <button type="submit" disabled={processing} className="bg-black text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50">
                                    {processing ? 'Enregistrement...' : 'Enregistrer le Slide'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Liste des slides actuels */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-widest border-b pb-2">Slides Actuels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sliders.map((slider) => (
                                <div key={slider.id} className="border rounded-lg overflow-hidden group relative">
                                    <img src={slider.image_url} alt={slider.titre} className="w-full h-40 object-cover" />
                                    <div className="p-4">
                                        <p className="font-bold text-sm uppercase">{slider.titre}</p>
                                        <p className="text-xs text-gray-500 italic">Ordre: {slider.ordre}</p>
                                        <button onClick={() => handleDelete(slider.id)} className="mt-4 text-red-600 text-xs font-bold uppercase hover:underline">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}