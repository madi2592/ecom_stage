import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import IconButton from "@/Components/IconButton";
import Modal from "@/Components/Modal"; // Import de ton composant Modal
import { Plus } from "lucide-react"; // Si tu as installé lucide-react

export default function Index({ auth, categories }) {
    const [showModal, setShowModal] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors
    } = useForm({
        id: null,
        nom: "",
        parent_id: "",
        description: "",
    });

    // OUVRIR MODALE : Ajout
    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setShowModal(true);
    };

    // OUVRIR MODALE : Modification
    const handleEdit = (category) => {
        setIsEditing(true);
        clearErrors();
        setData({
            id: category.id,
            nom: category.nom,
            parent_id: category.parent_id || "",
            description: category.description || "",
        });
        setShowModal(true);
    };

    // FERMER MODALE
    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route("admin.categories.update", data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("admin.categories.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            destroy(route("admin.categories.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Gestion des Catégories</h2>}
        >
            <Head title="Catégories" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* TABLEAU ET ENTÊTE */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Liste des catégories</h3>
                                <p className="text-sm text-gray-500">Gérez les catégories de votre catalogue</p>
                            </div>
                            <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                                <Plus size={18} /> Ajouter 
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parent</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-400">{cat.id}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{cat.nom}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${cat.parent ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                                    {cat.parent ? cat.parent.nom : "Principale"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[150px]">{cat.description || "---"}</td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono border border-gray-200">{cat.slug}</code>
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                                <IconButton iconName="SquarePen" variant="primary" onClick={() => handleEdit(cat)} />
                                                <IconButton iconName="Trash2" variant="danger" onClick={() => handleDelete(cat.id)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* LA MODALE */}
            <Modal show={showModal} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
                        {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
                    </h2>

                    <div className="mt-6 space-y-4">
                        {/* Champ Nom */}
                        <div>
                            <InputLabel htmlFor="nom" value="Nom de la catégorie" />
                            <TextInput
                                id="nom"
                                value={data.nom}
                                onChange={(e) => setData("nom", e.target.value)}
                                className="mt-1 block w-full"
                                required
                                isFocused={showModal}
                            />
                            <InputError message={errors.nom} className="mt-2" />
                        </div>

                        {/* Champ Parent */}
                        <div>
                            <InputLabel htmlFor="parent_id" value="Parent" />
                            <select
                                id="parent_id"
                                value={data.parent_id}
                                onChange={(e) => setData("parent_id", e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                            >
                                <option value="">Aucun (Principale)</option>
                                {categories
                                    .filter(c => c.id !== data.id) // Empêche une catégorie d'être son propre parent
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Champ Description */}
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? "Mettre à jour" : "Enregistrer"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}