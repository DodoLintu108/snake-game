<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\MiddlewareServiceProvider as ServiceProvider;
use App\Http\Middleware\VerifyCsrfToken;

class MiddlewareServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * The application's global middleware stack.
     *
     * @var array
     */
    protected $middleware = [
        VerifyCsrfToken::class,
        // Add other global middleware here...
    ];

    /**
     * The middleware groups for the application.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
        'api' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];
}
