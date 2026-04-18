import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ConfirmDialog from "@/Components/ConfirmDialog";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Plus, Ruler, SquarePen, Trash2, X } from "lucide-react";

export default function Index({ auth, guides, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

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
        categorie_id: "",
        taille: "",
        poitrine_cm: "",
        taille_cm: "",
        hanches_cm: "",
        pointure: "",
    });

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const openEditModal = (guide) => {
        setIsEditing(true);
        clearErrors();
        setData({
            id: guide.id,
            categorie_id: guide.categorie_id,
            taille: guide.taille,
            poitrine_cm: guide.poitrine_cm || "",
            taille_cm: guide.taille_cm || "",
            hanches_cm: guide.hanches_cm || "",
            pointure: guide.pointure || "",
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
            patch(route("admin.guides-tailles.update", data.id), {
                onSuccess: () => closeModal(),
            });
            return;
        }

        post(route("admin.guides-tailles.store"), {
            onSuccess: () => closeModal(),
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const confirmDelete = () => {
        if (!deleteDialog) {
            return;
        }

        destroy(route("admin.guides-tailles.destroy", deleteDialog), {
            onFinish: () => closeDeleteDialog(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Guides des Tailles</h2>}
        >
            <Head title="Guides des Tailles" />

            <div className="min-h-screen bg-gray-50/50 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Ruler className="text-indigo-600" size={20} />
                                    Référentiel des Tailles
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Définissez les mesures par catégorie pour aider vos clients
                                </p>
                            </div>
                            <PrimaryButton
                                onClick={openCreateModal}
                                className="flex items-center gap-2"
                            >
                                <Plus size={18} /> Ajouter une dimension
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto rounded-xl border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Catégorie
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Taille / Label
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Mesures (cm)
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {guides.map((guide) => (
                                        <tr
                                            key={guide.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {guide.categorie?.nom}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                                                    {guide.taille} {guide.pointure && `(${guide.pointure})`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                                                    {guide.poitrine_cm && (
                                                        <span>
                                                            Poitrine: <b>{guide.poitrine_cm}</b>
                                                        </span>
                                                    )}
                                                    {guide.taille_cm && (
                                                        <span>
                                                            Taille: <b>{guide.taille_cm}</b>
                                                        </span>
                                                    )}
                                                    {guide.hanches_cm && (
                                                        <span>
                                                            Hanches: <b>{guide.hanches_cm}</b>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => openEditModal(guide)}
                                                        className="text-amber-500 transition-colors hover:text-amber-700"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteDialog(guide.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <div className="mb-6 flex items-center justify-between border-b pb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            {isEditing ? "Modifier la dimension" : "Nouvelle dimension"}
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <InputLabel value="Catégorie concernée" />
                                <select
                                    value={data.categorie_id}
                                    onChange={(e) => setData("categorie_id", e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Sélectionner...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nom}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.categorie_id} />
                            </div>
                            <div>
                                <InputLabel value="Taille (S, M, XL, 42...)" />
                                <TextInput
                                    value={data.taille}
                                    onChange={(e) => setData("taille", e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.taille} />
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                Mesures en centimètres (Optionnel)
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <InputLabel value="Poitrine" />
                                    <TextInput
                                        type="number"
                                        step="0.01"
                                        value={data.poitrine_cm}
                                        onChange={(e) => setData("poitrine_cm", e.target.value)}
                                        className="mt-1 block w-full text-center"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Taille (Ventre)" />
                                    <TextInput
                                        type="number"
                                        step="0.01"
                                        value={data.taille_cm}
                                        onChange={(e) => setData("taille_cm", e.target.value)}
                                        className="mt-1 block w-full text-center"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Hanches" />
                                    <TextInput
                                        type="number"
                                        step="0.01"
                                        value={data.hanches_cm}
                                        onChange={(e) => setData("hanches_cm", e.target.value)}
                                        className="mt-1 block w-full text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Pointure (Si applicable)" />
                            <TextInput
                                value={data.pointure}
                                onChange={(e) => setData("pointure", e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Ex: 38-40"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-sm font-bold text-gray-500 hover:text-gray-700"
                        >
                            Annuler
                        </button>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? "Enregistrer les modifications" : "Créer le guide"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                show={Boolean(deleteDialog)}
                title="Supprimer cette dimension ?"
                message="Cette ligne sera supprimée définitivement du guide des tailles."
                confirmText="Oui, supprimer"
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}