<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();

        // If user's role is NOT in the allowed list
        if (! in_array($user->role, $roles)) {
            // Redirect them back to their "safe home" based on their role
            if ($user->role === 'cashier') return redirect('/pos');
            if ($user->role === 'kitchen_staff') return redirect('/kitchen');
            if ($user->role === 'waiter') return redirect('/tables');
            
            // Fallback
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
