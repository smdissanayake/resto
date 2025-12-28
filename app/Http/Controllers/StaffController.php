<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all users except strictly confidential system admins if needed, 
        // but for now fetch all updates ordered by role priority or name.
        $staff = User::orderBy('name')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'pin' => $user->pin, // Exposed to Admin for management
                // Real clock-in data would go here later
                'status' => 'Offline', // Placeholder for now until Shift system is built
                'clockIn' => null,
            ];
        });

        return Inertia::render('StaffShiftManagement', [
            'staff' => $staff
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => ['required', Rule::in(['admin', 'manager', 'cashier', 'waiter', 'kitchen_staff'])],
            'pin' => 'nullable|string|size:4|unique:users', // Ensure unique PINs
            'password' => 'nullable|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'pin' => $validated['pin'],
            'password' => Hash::make($validated['password'] ?? 'password'), // Default password if empty
        ]);

        return redirect()->back()->with('success', 'Staff member added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'manager', 'cashier', 'waiter', 'kitchen_staff'])],
            'pin' => ['nullable', 'string', 'size:4', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6', // Only validate if provided
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'pin' => $validated['pin'],
        ];

        // Only update password if a new one is provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'Staff details updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
             return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Staff member removed.');
    }
}
