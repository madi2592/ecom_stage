import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import {
    Plus,
    Image as ImageIcon,
    Eye,
    Trash2,
    SquarePen,
    X,
    CheckCircle2,
    AlertCircle,
    Tag,
    Layers,
} from "lucide-react";

export default function Index({ auth, produits, categories }) {
    const [showModal, setShowModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previews, setPreviews] = useState([]);

    const [variantData, setVariantData] = useState({
        taille: "",
        couleur: "",
        stock: 0,
    });

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        id: null,
        reference: "",
        libelle: "",
        categorie_id: "",
        description: "",
        prix: "",
        prix_promo: "",
        est_actif: true,
        images: [],
    });

    useEffect(() => {
        return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }, [previews]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData("images", files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setPreviews([]);
        reset();
        clearErrors();
        setShowModal(true);
    };

    const handleEdit = (produit) => {
        setIsEditing(true);
        setPreviews([]);
        clearErrors();
        setData({
            id: produit.id,
            reference: produit.reference,
            libelle: produit.libelle,
            categorie_id: produit.categorie_id,
            description: produit.description || "",
            prix: produit.prix,
            prix_promo: produit.prix_promo || "",
            est_actif: !!produit.est_actif,
            images: [],
        });
        setShowModal(true);
    };

    const handlePreview = (produit) => {
        setSelectedProduit(produit);
        setShowPreviewModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowPreviewModal(false);
        reset();
    };

    const handleAddVariant = (e) => {
        e.preventDefault();
        router.post(route("admin.variantes.store", data.id), variantData, {
            preserveScroll: true,
            onSuccess: () => {
                setVariantData({ taille: "", couleur: "", stock: 0 });
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Pour une modification avec des fichiers (images), on utilise post + _method: "PATCH"
            post(route("admin.produits.update", data.id), {
                ...data, // On envoie les données ici
                _method: "PATCH",
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            // Pour la création
            post(route("admin.produits.store"), {
                ...data, // On envoie les données ici
                onSuccess: () => closeModal(),
            });
        }
    };
    const handleDeleteImage = (imageId) => {
        if (confirm("Supprimer définitivement cette image ?")) {
            router.delete(route("admin.images.destroy", imageId), {
                preserveScroll: true,
            });
        }
    };

    const currentProduit = isEditing
        ? produits.find((p) => p.id === data.id)
        : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Catalogue Produits
                </h2>
            }
        >
            <Head title="Gestion Produits" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Liste des Produits
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Gérez vos articles et leurs stocks
                                </p>
                            </div>
                            <PrimaryButton
                                onClick={openCreateModal}
                                className="flex items-center gap-2"
                            >
                                <Plus size={18} /> Nouveau Produit
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                            Produit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                            Catégorie
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                            Prix Original/Vente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {produits.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg border overflow-hidden shadow-sm">
                                                        {p.image_principale ? (
                                                            <img
                                                                src={`/storage/${p.image_principale.chemin}`}
                                                                className="h-full w-full object-cover"
                                                                alt={p.libelle}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50">
                                                                <ImageIcon
                                                                    size={20}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                                                            {p.libelle}
                                                        </span>
                                                        <span className="text-[11px] text-gray-500 font-mono tracking-wider">
                                                            {p.reference}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {p.categorie?.nom ||
                                                    "Indéfinie"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    {p.prix_promo ? (
                                                        <>
                                                            <span className="font-bold text-green-600">
                                                                {p.prix_promo}{" "}
                                                                DH
                                                            </span>
                                                            <span className="text-xs text-red-500 line-through font-medium">
                                                                {p.prix} DH
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-gray-900">
                                                            {p.prix} DH
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        p.est_actif
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {p.est_actif
                                                        ? "Actif"
                                                        : "Inactif"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handlePreview(p)
                                                        }
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Aperçu"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(p)
                                                        }
                                                        className="p-2 text-amber-400 hover:bg-amber-50 rounded"
                                                    >
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Supprimer ?",
                                                                )
                                                            )
                                                                destroy(
                                                                    route(
                                                                        "admin.produits.destroy",
                                                                        p.id,
                                                                    ),
                                                                );
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-400 rounded"
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

            {/* ============================================================
                MODAL CRÉATION / MODIFICATION
                - maxWidth="2xl" pour un rendu compact
                - Colonne unique (flex flex-col)
                - Variantes placées juste après les prix
                - grid-cols-12 pour les inputs variantes
                - Sticky footer pour les boutons
            ============================================================ */}
            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col max-h-[90vh]">
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg">
                            Attention, il y a des erreurs dans le formulaire.
                        </div>
                    )}
                    {/* En-tête fixe */}
                    <div className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing
                                ? `Modifier : ${data.libelle}`
                                : "Nouveau Produit"}
                        </h2>
                    </div>

                    {/* Corps scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                        {/* Référence + Catégorie */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Référence (SKU)" />
                                <TextInput
                                    value={data.reference}
                                    onChange={(e) =>
                                        setData("reference", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.reference} />
                            </div>
                            <div>
                                <InputLabel value="Catégorie" />
                                <select
                                    value={data.categorie_id}
                                    onChange={(e) =>
                                        setData("categorie_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Choisir...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nom}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.categorie_id} />
                            </div>
                        </div>

                        {/* Libellé */}
                        <div>
                            <InputLabel value="Libellé" />
                            <TextInput
                                value={data.libelle}
                                onChange={(e) =>
                                    setData("libelle", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.libelle} />
                        </div>

                        {/* Prix */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Prix (DH)" />
                                <TextInput
                                    type="number"
                                    value={data.prix}
                                    onChange={(e) =>
                                        setData("prix", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.prix} />
                            </div>
                            <div>
                                <InputLabel value="Prix Promo (DH)" />
                                <TextInput
                                    type="number"
                                    value={data.prix_promo}
                                    onChange={(e) =>
                                        setData("prix_promo", e.target.value)
                                    }
                                    className="mt-1 block w-full text-green-600 font-bold"
                                />
                            </div>
                        </div>

                        {/* ---- SECTION VARIANTES (juste après les prix, mode édition) ---- */}
                        {isEditing && (
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Layers
                                        size={15}
                                        className="text-indigo-600"
                                    />
                                    <InputLabel
                                        value="Variantes (Tailles, Couleurs & Stocks)"
                                        className="font-bold text-indigo-600 !mb-0"
                                    />
                                </div>

                                {/* Formulaire rapide d'ajout — grid-cols-12 */}
                                <div className="grid grid-cols-12 gap-2 mb-3 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100">
                                    {/* Taille — col-span-4 */}
                                    <div className="col-span-4">
                                        <TextInput
                                            placeholder="Taille (XL, 42…)"
                                            value={variantData.taille}
                                            onChange={(e) =>
                                                setVariantData({
                                                    ...variantData,
                                                    taille: e.target.value,
                                                })
                                            }
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    {/* Couleur — col-span-4 */}
                                    <div className="col-span-4">
                                        <TextInput
                                            placeholder="Couleur (ex: Rouge)"
                                            value={variantData.couleur}
                                            onChange={(e) =>
                                                setVariantData({
                                                    ...variantData,
                                                    couleur: e.target.value,
                                                })
                                            }
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    {/* Stock — col-span-2 */}
                                    <div className="col-span-2">
                                        <TextInput
                                            type="number"
                                            placeholder="Stock"
                                            value={variantData.stock}
                                            onChange={(e) =>
                                                setVariantData({
                                                    ...variantData,
                                                    stock: e.target.value,
                                                })
                                            }
                                            className="w-full text-sm font-bold"
                                        />
                                    </div>
                                    {/* Bouton Ajouter — col-span-2 */}
                                    <div className="col-span-2 flex">
                                        <button
                                            type="button"
                                            onClick={handleAddVariant}
                                            className="w-full bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 px-2 py-2 uppercase whitespace-nowrap transition-colors"
                                        >
                                            + Ajouter
                                        </button>
                                    </div>
                                </div>

                                {/* Tableau des variantes existantes */}
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">
                                                    Taille
                                                </th>
                                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">
                                                    Couleur
                                                </th>
                                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">
                                                    Stock
                                                </th>
                                                <th className="px-4 py-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentProduit?.variantes?.length >
                                            0 ? (
                                                currentProduit.variantes.map(
                                                    (v) => (
                                                        <tr
                                                            key={v.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-2 text-sm text-gray-700">
                                                                {v.taille}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm text-gray-700">
                                                                {v.couleur}
                                                            </td>
                                                            <td className="px-4 py-2 text-sm font-bold text-gray-900">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                        v.stock >
                                                                        0
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                    }`}
                                                                >
                                                                    {v.stock}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                "Supprimer cette variante ?",
                                                                            )
                                                                        )
                                                                            router.delete(
                                                                                route(
                                                                                    "admin.variantes.destroy",
                                                                                    v.id,
                                                                                ),
                                                                                {
                                                                                    preserveScroll: true,
                                                                                },
                                                                            );
                                                                    }}
                                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="px-4 py-4 text-center text-xs text-gray-400 italic"
                                                    >
                                                        Aucune variante
                                                        enregistrée.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Galerie produit */}
                        <div className="pt-4 border-t border-gray-200">
                            <InputLabel
                                value="Galerie produit"
                                className="mb-2"
                            />

                            {isEditing &&
                                currentProduit?.images?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-50 border rounded-lg">
                                        {currentProduit.images.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative group w-16 h-16 flex-shrink-0 shadow-sm border rounded overflow-hidden"
                                            >
                                                <img
                                                    src={`/storage/${img.chemin}`}
                                                    className="h-full w-full object-cover"
                                                    alt="Produit"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteImage(
                                                            img.id,
                                                        )
                                                    }
                                                    className="absolute top-0 right-0 bg-gray-800 text-white rounded transition-opacity shadow-lg"
                                                >
                                                    <X
                                                        size={10}
                                                        strokeWidth={3}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors relative">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon
                                        className="text-gray-400"
                                        size={24}
                                    />
                                    <span className="text-[11px] text-gray-500">
                                        Ajouter des photos…
                                    </span>
                                </div>
                            </div>

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 p-2 bg-gray-50 border rounded-lg">
                                    {previews.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative w-16 h-16 flex-shrink-0 shadow-sm border rounded overflow-hidden"
                                        >
                                            <img
                                                src={url}
                                                className="h-full w-full object-cover"
                                                alt="preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newFiles = [
                                                        ...data.images,
                                                    ];
                                                    newFiles.splice(index, 1);
                                                    setData("images", newFiles);
                                                    const newPreviews = [
                                                        ...previews,
                                                    ];
                                                    URL.revokeObjectURL(
                                                        newPreviews[index],
                                                    );
                                                    newPreviews.splice(
                                                        index,
                                                        1,
                                                    );
                                                    setPreviews(newPreviews);
                                                }}
                                                className="absolute top-0 right-0 bg-gray-800 text-white rounded"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel value="Description" />
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Statut de visibilité */}
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                id="est_actif"
                                type="checkbox"
                                checked={data.est_actif}
                                onChange={(e) =>
                                    setData("est_actif", e.target.checked)
                                }
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label
                                htmlFor="est_actif"
                                className="text-sm font-bold text-gray-700 cursor-pointer select-none"
                            >
                                Rendre le produit actif (Visible sur le site)
                            </label>
                        </div>
                    </div>

                    {/* Footer sticky */}
                    <div className="flex-shrink-0 px-6 py-4 border-t bg-white flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Annuler
                        </button>
                        <PrimaryButton disabled={processing}>
                            {isEditing ? "Mettre à jour" : "Créer le produit"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ============================================================
                MODAL D'APERÇU RAPIDE
                - Colonne unique responsive (grid-cols-1 / md:grid-cols-2)
                - max-h-[90vh] + overflow-y-auto sur le corps
                - object-contain sur l'image principale
                - Miniatures agrandies (w-20 h-20)
                - Bloc tarification compact
                - Sticky footer avec "Modifier" et "Fermer"
            ============================================================ */}
            <Modal show={showPreviewModal} onClose={closeModal} maxWidth="3xl">
                {selectedProduit && (
                    <div className="flex flex-col max-h-[90vh]">
                        {/* En-tête fixe */}
                        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                                    {selectedProduit.libelle}
                                </h2>
                                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-0.5">
                                    REF : {selectedProduit.reference}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Corps scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ---- Colonne gauche : Galerie ---- */}
                                <div className="space-y-3">
                                    {/* Image principale — object-contain pour ne pas déformer */}
                                    <div
                                        className="rounded-xl overflow-hidden border bg-gray-50 shadow-inner flex items-center justify-center"
                                        style={{
                                            maxHeight: "320px",
                                            minHeight: "200px",
                                        }}
                                    >
                                        {selectedProduit.image_principale ? (
                                            <img
                                                src={`/storage/${selectedProduit.image_principale.chemin}`}
                                                className="w-full h-full object-contain"
                                                style={{ maxHeight: "320px" }}
                                                alt={selectedProduit.libelle}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-300 py-10">
                                                <ImageIcon size={56} />
                                                <span className="text-xs text-gray-400">
                                                    Aucune image
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Miniatures agrandies — w-20 h-20 */}
                                    {selectedProduit.images?.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {selectedProduit.images.map(
                                                (img) => (
                                                    <div
                                                        key={img.id}
                                                        className="w-full aspect-square rounded-lg border overflow-hidden hover:opacity-80 cursor-pointer transition-opacity shadow-sm"
                                                    >
                                                        <img
                                                            src={`/storage/${img.chemin}`}
                                                            className="w-full h-full object-cover"
                                                            alt="miniature"
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ---- Colonne droite : Informations ---- */}
                                <div className="flex flex-col gap-4">
                                    {/* Statut + Catégorie alignés */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                selectedProduit.est_actif
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {selectedProduit.est_actif ? (
                                                <CheckCircle2 size={12} />
                                            ) : (
                                                <AlertCircle size={12} />
                                            )}
                                            {selectedProduit.est_actif
                                                ? "En vente"
                                                : "Hors ligne"}
                                        </span>
                                        {selectedProduit.categorie?.nom && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border">
                                                <Tag size={11} />
                                                {selectedProduit.categorie.nom}
                                            </span>
                                        )}
                                    </div>

                                    {/* Bloc Tarification compact */}
                                    <div className="p-3 bg-gray-50 rounded-xl border">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5">
                                            Tarification
                                        </p>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            {selectedProduit.prix_promo ? (
                                                <>
                                                    <span className="text-2xl font-black text-green-600">
                                                        {
                                                            selectedProduit.prix_promo
                                                        }{" "}
                                                        DH
                                                    </span>
                                                    <span className="text-base text-red-400 line-through font-medium opacity-70">
                                                        {selectedProduit.prix}{" "}
                                                        DH
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-black text-gray-900">
                                                    {selectedProduit.prix} DH
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Description
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                                            {selectedProduit.description ||
                                                "Aucune description fournie."}
                                        </p>
                                    </div>

                                    {/* Variantes dans l'aperçu (lecture seule) */}
                                    {selectedProduit.variantes?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Variantes disponibles
                                            </h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedProduit.variantes.map(
                                                    (v) => (
                                                        <span
                                                            key={v.id}
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                                                v.stock > 0
                                                                    ? "bg-white text-gray-700 border-gray-200"
                                                                    : "bg-gray-100 text-gray-400 border-gray-200 line-through"
                                                            }`}
                                                        >
                                                            {v.taille && (
                                                                <span>
                                                                    {v.taille}
                                                                </span>
                                                            )}
                                                            {v.couleur && (
                                                                <span className="text-gray-400">
                                                                    /{" "}
                                                                    {v.couleur}
                                                                </span>
                                                            )}
                                                            <span
                                                                className={`ml-0.5 font-bold ${
                                                                    v.stock > 0
                                                                        ? "text-green-600"
                                                                        : "text-red-400"
                                                                }`}
                                                            >
                                                                ({v.stock})
                                                            </span>
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer sticky */}
                        <div className="flex-shrink-0 px-6 py-4 border-t bg-white flex gap-3">
                            <PrimaryButton
                                onClick={() => {
                                    closeModal();
                                    handleEdit(selectedProduit);
                                }}
                                className="flex-1 flex justify-center items-center gap-2"
                            >
                                <SquarePen size={16} /> Modifier l'article
                            </PrimaryButton>
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-bold text-sm transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
