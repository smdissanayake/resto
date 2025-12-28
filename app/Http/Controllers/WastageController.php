<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WastageController extends Controller
{
    public function index()
    {
        // This might be returned as part of InventoryController, but if called directly via API:
        $wastage = DB::table('inventory_wastage')
            ->join('inventory_items', 'inventory_wastage.inventory_item_id', '=', 'inventory_items.id')
            ->join('users', 'inventory_wastage.user_id', '=', 'users.id')
            ->select(
                'inventory_wastage.*', 
                'inventory_items.name as item_name', 
                'inventory_items.unit',
                'users.name as user_name'
            )
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($wastage);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'quantity' => 'required|numeric|min:0.001',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $item = InventoryItem::findOrFail($validated['inventory_item_id']);

            // Calculate cost at time of wastage
            $cost = $item->price_per_unit * $validated['quantity'];

            // Record Wastage
            DB::table('inventory_wastage')->insert([
                'inventory_item_id' => $item->id,
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'],
                'notes' => $validated['notes'] ?? null,
                'cost' => $cost,
                'user_id' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Decrement Stock
            $item->decrement('stock_level', $validated['quantity']);

            DB::commit();

            return redirect()->back()->with('success', 'Wastage reported successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to report wastage: ' . $e->getMessage());
        }
    }
}
