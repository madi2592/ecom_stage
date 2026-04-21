<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info'    => $request->session()->get('info'),
                'commande_confirmee' => $request->session()->get('commande_confirmee'),
            ],
            // panier partagé globalement → accessible dans FrontLayout via usePage().props
            'panier' => function () {
                return Session::get('panier', []);
            },
            // cartCount dérivé du panier (nombre total d'articles)
            'cartCount' => function () {
                $panier = Session::get('panier', []);
                return array_sum(array_column($panier, 'quantite'));
            },
        ];
    }
}