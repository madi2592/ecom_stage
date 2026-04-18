import React from 'react';
import * as Icons from 'lucide-react';

export default function IconButton({ 
    iconName, 
    className = '', 
    variant = 'primary', 
    ...props 
}) {
    // On récupère dynamiquement l'icône
    const Icon = Icons[iconName];

    // Définition des styles selon la variante
    const variants = {
        primary: 'text-indigo-600 hover:bg-indigo-50',
        danger: 'text-red-600 hover:bg-red-50',
        success: 'text-green-600 hover:bg-green-50',
    };

    return (
        <button
            {...props}
            className={`p-2 rounded-full transition-colors duration-200 ${variants[variant]} ${className}`}
        >
            {Icon && <Icon size={18} />}
        </button>
    );
}