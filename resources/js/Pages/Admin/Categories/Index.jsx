import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfirmDialog from "@/Components/ConfirmDialog";
import IconButton from "@/Components/IconButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Plus } from "lucide-react";

export default function Index({ auth, categories }) {
    const [showModal, setShowModal] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [deleteDialog, setDeleteDialog] = React.useState(false);

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id: null,
        nom: "",
        parent_id: "",
        description: "",
    });

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setShowModal(true);
    };

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
            return;
        }

        post(route("admin.categories.store"), {
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        setDeleteDialog(id);
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const confirmDelete = () => {
        if (!deleteDialog) {
            return;
        }

        destroy(route("admin.categories.destroy", deleteDialog), {
            onFinish: () => closeDeleteDialog(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestion des Catégories
                </h2>
            }
        >
            <Head title="Catégories" />

            <div className="min-h-screen bg-gray-50/50 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Liste des catégories
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Gérez les catégories de votre catalogue
                                </p>
                            </div>

                            <PrimaryButton
                                onClick={openCreateModal}
                                className="flex items-center gap-2"
                            >
                                <Plus size={18} /> Ajouter
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 rounded-lg border">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="w-16 px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Parent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {categories.map((cat) => (
                                        <tr
                                            key={cat.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                                {cat.id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {cat.nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full border px-2 py-1 text-xs font-medium ${
                                                        cat.parent
                                                            ? "border-blue-100 bg-blue-50 text-blue-700"
                                                            : "border-green-100 bg-green-50 text-green-700"
                                                    }`}
                                                >
                                                    {cat.parent ? cat.parent.nom : "Principale"}
                                                </span>
                                            </td>
                                            <td className="max-w-[150px] truncate px-6 py-4 text-sm text-gray-500">
                                                {cat.description || "---"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                                                    {cat.slug}
                                                </code>
                                            </td>
                                            <td className="space-x-2 whitespace-nowrap px-6 py-4 text-center">
                                                <IconButton
                                                    iconName="SquarePen"
                                                    variant="primary"
                                                    onClick={() => handleEdit(cat)}
                                                />
                                                <IconButton
                                                    iconName="Trash2"
                                                    variant="danger"
                                                    onClick={() => handleDelete(cat.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="border-b pb-3 text-lg font-bold text-gray-900">
                        {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
                    </h2>

                    <div className="mt-6 space-y-4">
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

                        <div>
                            <InputLabel htmlFor="parent_id" value="Parent" />
                            <select
                                id="parent_id"
                                value={data.parent_id}
                                onChange={(e) => setData("parent_id", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Aucun (Principale)</option>
                                {categories
                                    .filter((c) => c.id !== data.id)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? "Mettre à jour" : "Enregistrer"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={Boolean(deleteDialog)}
                title="Supprimer cette catégorie ?"
                message="Cette action est définitive. La catégorie sera retirée immédiatement de votre catalogue."
                confirmText="Oui, supprimer"
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}