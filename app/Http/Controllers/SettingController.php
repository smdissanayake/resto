<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = DB::table('settings')->pluck('value', 'key');
        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'restaurant_name' => 'nullable|string|max:255',
            'currency_symbol' => 'nullable|string|max:10',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
            'logo' => 'nullable|image|max:2048' // 2MB Max
        ]);

        foreach ($validated as $key => $value) {
            if ($key === 'logo') continue; // Handle file separately
            
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Handle File Upload
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            DB::table('settings')->updateOrInsert(
                ['key' => 'logo_path'],
                ['value' => '/storage/' . $path]
            );
        }

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}
