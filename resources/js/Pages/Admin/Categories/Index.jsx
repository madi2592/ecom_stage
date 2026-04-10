import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, categories }) {
    // 1. Initialisation du formulaire Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        parent_id: '',
        description: '', // Gardé pour la cohérence
    });

    // 2. Fonction de soumission
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user} // <--- TRÈS IMPORTANT : Correction de l'erreur "null reading name"
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Gestion des Catégories</h2>}
        >
            <Head title="Catégories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* SECTION : Formulaire de création */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <header>
                            <h3 className="text-lg font-medium text-gray-900">Ajouter une catégorie</h3>
                            <p className="mt-1 text-sm text-gray-600">Créez une nouvelle catégorie ou sous-catégorie pour votre boutique.</p>
                        </header>

                        <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
                            {/* Champ Nom */}
                            <div>
                                <InputLabel htmlFor="nom" value="Nom de la catégorie" />
                                <TextInput
                                    id="nom"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.nom} className="mt-2" />
                            </div>

                            {/* Champ Parent */}
                            <div>
                                <InputLabel htmlFor="parent_id" value="Catégorie Parente (Optionnel)" />
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                >
                                    <option value="">Aucune (Catégorie principale)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                    ))}
                                </select>
                                <InputError message={errors.parent_id} className="mt-2" />
                            </div>

                            {/* NOUVEAU : Champ Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description (Optionnel)" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* SECTION : Liste des catégories */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Liste existante</h3>
                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories && categories.length > 0 ? categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {cat.nom}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {cat.parent ? cat.parent.nom : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {/* On affiche la description ou un petit message si c'est vide */}
                                            {cat.description || <span className="text-gray-300 italic">Aucune</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {cat.slug}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            Aucune catégorie trouvée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}