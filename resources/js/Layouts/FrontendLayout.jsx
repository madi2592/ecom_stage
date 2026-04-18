import React from 'react';
import { Link } from '@inertiajs/react';

export default function FrontendLayout({ user, children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="font-black text-2xl tracking-tighter italic">
                            Click'n'Buy
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-sm font-medium hover:underline">Boutique</Link>
                            {user ? (
                                <Link href="/dashboard" className="text-sm font-medium">{user.name}</Link>
                            ) : (
                                <Link href="/login" className="text-sm font-medium">Connexion</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}