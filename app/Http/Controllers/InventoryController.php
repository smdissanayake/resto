<?php

namespace App\Http\Controllers;

use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::with('category');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->category && $request->category !== 'All') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // Sort by stock level (low stock first) by default
        $items = $query->orderBy('stock_level', 'asc')->get();
        $categories = InventoryCategory::all();

        return Inertia::render('InventoryManagement', [
            'items' => $items,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255', // We'll find or create category
            'stock_level' => 'required|numeric|min:0',
            'unit' => 'required|string|max:10',
            'usage_unit' => 'nullable|string|max:10',
            'conversion_factor' => 'nullable|numeric|min:0.0001',
            'price_per_unit' => 'required|numeric|min:0',
            'reorder_threshold' => 'required|integer|min:0'
        ]);

        // Find or create category
        $category = InventoryCategory::firstOrCreate(
            ['name' => $validated['category_name']],
            ['slug' => \Illuminate\Support\Str::slug($validated['category_name'])]
        );

        InventoryItem::create([
            'inventory_category_id' => $category->id,
            'name' => $validated['name'],
            'stock_level' => $validated['stock_level'],
            'unit' => $validated['unit'],
            'usage_unit' => $validated['usage_unit'] ?? null,
            'conversion_factor' => $validated['conversion_factor'] ?? 1.0,
            'price_per_unit' => $validated['price_per_unit'],
            'reorder_threshold' => $validated['reorder_threshold']
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $item = InventoryItem::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255',
            'stock_level' => 'required|numeric|min:0',
            'unit' => 'required|string|max:10',
            'usage_unit' => 'nullable|string|max:10',
            'conversion_factor' => 'nullable|numeric|min:0.0001',
            'price_per_unit' => 'required|numeric|min:0',
            'reorder_threshold' => 'required|integer|min:0'
        ]);

        $category = InventoryCategory::firstOrCreate(
            ['name' => $validated['category_name']],
            ['slug' => \Illuminate\Support\Str::slug($validated['category_name'])]
        );

        $item->update([
            'inventory_category_id' => $category->id,
            'name' => $validated['name'],
            'stock_level' => $validated['stock_level'],
            'unit' => $validated['unit'],
            'usage_unit' => $validated['usage_unit'] ?? null,
            'conversion_factor' => $validated['conversion_factor'] ?? 1.0,
            'price_per_unit' => $validated['price_per_unit'],
            'reorder_threshold' => $validated['reorder_threshold']
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        InventoryItem::findOrFail($id)->delete();
        return redirect()->back();
    }
}
