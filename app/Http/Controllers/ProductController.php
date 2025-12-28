<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('ingredients')->orderBy('created_at', 'desc')->paginate(10);
        $inventoryItems = \App\Models\InventoryItem::select('id', 'name', 'unit', 'usage_unit')->orderBy('name')->get();

        return Inertia::render('MenuManagement', [
            'products' => $products,
            'inventoryItems' => $inventoryItems
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'type' => 'required|in:kitchen,retail',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|max:10240', // 10MB Max
            'is_available' => 'boolean',
            'ingredients' => 'nullable|array',
            'ingredients.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('products', 'public');
        }

        $product = Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'type' => $validated['type'],
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'description' => $validated['description'] ?? '',
            'is_available' => $validated['is_available'] ?? true,
            'image' => $imagePath ? '/storage/' . $imagePath : 'https://via.placeholder.com/150',
            'modifiers' => $validated['modifiers'] ?? []
        ]);

        if (isset($validated['ingredients']) && $validated['type'] === 'kitchen') {
            $syncData = [];
            foreach ($validated['ingredients'] as $ingredient) {
                $syncData[$ingredient['inventory_item_id']] = ['quantity' => $ingredient['quantity']];
            }
            $product->ingredients()->sync($syncData);
        }

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'type' => 'required|in:kitchen,retail',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|max:2048',
            'is_available' => 'boolean',
            'ingredients' => 'nullable|array',
            'ingredients.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
            'modifiers' => 'nullable|array'
        ]);

        $data = [
            'name' => $validated['name'],
            'category' => $validated['category'],
            'type' => $validated['type'],
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'description' => $validated['description'] ?? '',
            'is_available' => $validated['is_available'] ?? true,
            'modifiers' => $validated['modifiers'] ?? []
        ];

        if ($request->hasFile('image_file')) {
            // Optional: Delete old image if it exists and is local
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                 $oldPath = str_replace('/storage/', '', $product->image);
                 Storage::disk('public')->delete($oldPath);
            }
            
            $imagePath = $request->file('image_file')->store('products', 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        $product->update($data);

        if (isset($validated['ingredients']) && $validated['type'] === 'kitchen') {
            $syncData = [];
            foreach ($validated['ingredients'] as $ingredient) {
                $syncData[$ingredient['inventory_item_id']] = ['quantity' => $ingredient['quantity']];
            }
            $product->ingredients()->sync($syncData);
        } else if ($validated['type'] === 'retail') {
            // If switched to retail, remove ingredients
            $product->ingredients()->detach();
        }

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete image if local
        if ($product->image && str_starts_with($product->image, '/storage/')) {
                 $oldPath = str_replace('/storage/', '', $product->image);
                 Storage::disk('public')->delete($oldPath);
        }
        
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
