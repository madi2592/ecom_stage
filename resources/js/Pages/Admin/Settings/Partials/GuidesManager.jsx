import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import { Plus, Ruler, SquarePen, Trash2, X } from "lucide-react";

export default function GuidesManager({ guides, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm({
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
        } else {
            post(route("admin.guides-tailles.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Supprimer cette ligne ?")) {
            router.delete(route("admin.guides-tailles.destroy", id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Ruler className="text-indigo-600" size={20} /> Référentiel des Tailles
                    </h3>
                    <p className="text-sm text-gray-500">Définissez les mesures par catégorie</p>
                </div>
                <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                    <Plus size={18} /> Ajouter une dimension
                </PrimaryButton>
            </div>

            <div className="overflow-x-auto border rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Catégorie</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Taille / Label</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mesures (cm)</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {guides.map((guide) => (
                            <tr key={guide.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {guide.categorie?.nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                        {guide.taille} {guide.pointure && `(${guide.pointure})`}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-4">
                                        {guide.poitrine_cm && <span>Poitrine: <b>{guide.poitrine_cm}</b></span>}
                                        {guide.taille_cm && <span>Taille: <b>{guide.taille_cm}</b></span>}
                                        {guide.hanches_cm && <span>Hanches: <b>{guide.hanches_cm}</b></span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center space-x-3">
                                    <button onClick={() => openEditModal(guide)} className="text-amber-500 hover:text-amber-700"><SquarePen size={18} /></button>
                                    <button onClick={() => handleDelete(guide.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-900">{isEditing ? "Modifier la dimension" : "Nouvelle dimension"}</h2>
                        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Catégorie concernée" />
                                <select
                                    value={data.categorie_id}
                                    onChange={(e) => setData("categorie_id", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    required
                                >
                                    <option value="">Sélectionner...</option>
                                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.nom}</option>))}
                                </select>
                                <InputError message={errors.categorie_id} />
                            </div>
                            <div>
                                <InputLabel value="Taille (S, 42...)" />
                                <TextInput value={data.taille} onChange={(e) => setData("taille", e.target.value)} className="mt-1 block w-full" required />
                                <InputError message={errors.taille} />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-3 gap-4">
                            <div><InputLabel value="Poitrine" /><TextInput type="number" step="0.01" value={data.poitrine_cm} onChange={(e) => setData("poitrine_cm", e.target.value)} className="w-full text-center" /></div>
                            <div><InputLabel value="Taille" /><TextInput type="number" step="0.01" value={data.taille_cm} onChange={(e) => setData("taille_cm", e.target.value)} className="w-full text-center" /></div>
                            <div><InputLabel value="Hanches" /><TextInput type="number" step="0.01" value={data.hanches_cm} onChange={(e) => setData("hanches_cm", e.target.value)} className="w-full text-center" /></div>
                        </div>

                        <div>
                            <InputLabel value="Pointure (Si applicable)" />
                            <TextInput value={data.pointure} onChange={(e) => setData("pointure", e.target.value)} className="w-full" placeholder="Ex: 38-40" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <button type="button" onClick={closeModal} className="text-sm font-bold text-gray-500">Annuler</button>
                        <PrimaryButton disabled={processing}>{isEditing ? "Enregistrer" : "Créer"}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}