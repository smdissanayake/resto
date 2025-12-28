<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Rate Limiting: Key is based on IP address
        $key = 'login_attempts:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ['Too many login attempts. Please try again in ' . ceil($seconds / 60) . ' minutes.'],
                'pin' => ['Too many login attempts. Please try again in ' . ceil($seconds / 60) . ' minutes.'],
            ]);
        }

        try {
            // 1. PIN Login
            if ($request->has('pin')) {
                $request->validate(['pin' => 'required|string']);
                
                $user = User::where('pin', $request->pin)->first();

                if (! $user) {
                    RateLimiter::hit($key, 600); // 10 minutes decay
                    throw ValidationException::withMessages([
                        'pin' => ['Invalid PIN.'],
                    ]);
                }

                // SECURITY UPDATE: Prevent Admin/Manager from using PIN (Must use Password)
                if (in_array($user->role, ['admin', 'manager'])) {
                    // Don't hit rate limiter for this specific security policy check to avoid locking out legitimate admins who forgot
                    throw ValidationException::withMessages([
                        'pin' => ['Admins must login via Email & Password for security.'],
                    ]);
                }

                Auth::login($user);
                $request->session()->regenerate();
                RateLimiter::clear($key);

                return redirect()->intended($this->getRedirectPath($user));
            }

            // 2. Email/Password Login
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();
                RateLimiter::clear($key);

                return redirect()->intended($this->getRedirectPath(Auth::user()));
            }

            RateLimiter::hit($key, 600); // 10 minutes decay
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);

        } catch (\Exception $e) {
            // Re-throw exception to be handled by Laravel (and display error to user)
            throw $e;
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function getRedirectPath($user)
    {
        // Role-based redirection
        switch ($user->role) {
            case 'admin':
                return '/dashboard';
            case 'manager':
                return '/dashboard';
            case 'cashier':
                return '/pos';
            case 'kitchen_staff':
                return '/kitchen';
            case 'waiter':
                return '/tables'; // Or maybe POS in 'waiter mode' later
            default:
                return '/dashboard';
        }
    }
}
