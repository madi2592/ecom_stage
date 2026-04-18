import Modal from '@/Components/Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
    show = false,
    title = 'Confirmer l action',
    message = 'Cette action est irreversible.',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm = () => {},
    onClose = () => {},
    processing = false,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <AlertTriangle size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Suppression...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}