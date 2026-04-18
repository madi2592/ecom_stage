import { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const ALERT_STYLES = {
    success: {
        icon: CheckCircle,
        accent: "border-emerald-500",
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        title: "Succès",
    },
    error: {
        icon: AlertCircle,
        accent: "border-rose-500",
        iconColor: "text-rose-600",
        iconBg: "bg-rose-100",
        title: "Erreur",
    },
    warning: {
        icon: AlertTriangle,
        accent: "border-amber-500",
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100",
        title: "Attention",
    },
    info: {
        icon: Info,
        accent: "border-sky-500",
        iconColor: "text-sky-600",
        iconBg: "bg-sky-100",
        title: "Information",
    },
};

export default function FlashAlert({ alerts = [], onDismiss }) {
    useEffect(() => {
        const timers = alerts
            .filter((alert) => alert.type === "success")
            .map((alert) =>
                window.setTimeout(() => {
                    onDismiss(alert.id);
                }, 5000),
            );

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [alerts, onDismiss]);

    if (!alerts.length) {
        return null;
    }

    return (
        <>
            <style>
                {`
                    @keyframes flash-slide-in {
                        from {
                            opacity: 0;
                            transform: translate3d(0, -12px, 0) scale(0.98);
                        }
                        to {
                            opacity: 1;
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }
                `}
            </style>

            <div className="pointer-events-none fixed top-5 right-5 z-[100] flex w-full max-w-md flex-col gap-3 px-4 sm:px-0">
                {alerts.map((alert) => {
                    const config =
                        ALERT_STYLES[alert.type] ?? ALERT_STYLES.info;
                    const Icon = config.icon;

                    return (
                        <div
                            key={alert.id}
                            className={`pointer-events-auto w-full overflow-hidden rounded-xl border-l-4 ${config.accent} bg-white shadow-2xl ring-1 ring-slate-200/70`}
                            style={{
                                animation: "flash-slide-in 0.35s ease-out",
                            }}
                        >
                            <div className="flex items-start gap-4 p-4">
                                <div
                                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${config.iconColor}`}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {config.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {alert.message}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onDismiss(alert.id)}
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                    aria-label="Fermer la notification"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
