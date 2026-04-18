import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Connexion" />

            {/* Fond bleu clair plein écran */}
            <div className="min-h-screen bg-[#e8edf5] flex items-center justify-center px-4 py-12">
                {/* Carte blanche */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-10 py-12">
                    {/* Logo + Titre */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            {/* Logo Click'n'Buy adapté au style de l'image */}
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#3b9eff] flex items-center justify-center">
                                <span className="text-white font-black text-base leading-none">
                                    C
                                </span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900">
                                Click'n'
                                <span className="text-[#0315ff]">Buy</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            Votre boutique de mode en ligne
                        </p>
                    </div>

                    {/* Message de statut (ex: reset password) */}
                    {status && (
                        <div className="mb-6 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-3">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Champ Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
                                placeholder="votre@email.com"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* Champ Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full h-12 px-4 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
                                placeholder="••••••••"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 rounded accent-[#6c63ff] cursor-pointer"
                                />
                                <span className="text-sm text-gray-600">
                                    Se souvenir de moi
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-[#6c63ff] font-medium hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                        {/* Bouton Sign In */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 mt-2 bg-[#6c63ff] hover:bg-[#0315ff] text-white font-semibold rounded-lg text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    {/* Lien inscription */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Pas encore de compte ?{" "}
                        <Link
                            href={route("register")}
                            className="text-[#6c63ff] font-medium hover:underline"
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
