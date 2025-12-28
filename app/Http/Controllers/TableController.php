<?php

namespace App\Http\Controllers;

use App\Models\DiningTable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        return Inertia::render('TableManagement', [
            'tables' => DiningTable::with(['currentOrder.items'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'seats' => 'required|integer|min:1',
            'position_x' => 'nullable|integer',
            'position_y' => 'nullable|integer',
        ]);

        DiningTable::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $table = DiningTable::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'seats' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:free,occupied,reserved,unavailable',
            'position_x' => 'sometimes|integer',
            'position_y' => 'sometimes|integer',
            'current_order_id' => 'nullable|exists:orders,id',
            'waiter_name' => 'nullable|string|max:255',
            'reservation_name' => 'nullable|string|max:255',
            'reservation_time' => 'nullable|date',
        ]);

        $table->update($validated);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $table = DiningTable::findOrFail($id);
        if ($table->status === 'occupied') {
            return redirect()->back()->withErrors(['message' => 'Cannot delete an occupied table']);
        }
        $table->delete();

        return redirect()->back();
    }

    // New Settlement Method
    public function settle(Request $request, $id)
    {
        $table = DiningTable::findOrFail($id);
        
        if (!$table->current_order_id) {
             // Already free? allow reset but warn
             $table->update(['status' => 'free']);
             return redirect()->back();
        }

        $order = \App\Models\Order::findOrFail($table->current_order_id);

        // Check for discount in request
        if ($request->has('discount')) {
            $order->discount = $request->input('discount', 0);
            $order->discount_type = $request->input('discount_type', 'percentage');
            // Recalculate total
            $grossTotal = $order->items()->sum(\Illuminate\Support\Facades\DB::raw('quantity * unit_price'));
            
            $netTotal = $grossTotal;
            if ($order->discount > 0) {
                 if ($order->discount_type === 'percentage') {
                     $netTotal = $grossTotal - ($grossTotal * ($order->discount / 100));
                 } else {
                     $netTotal = $grossTotal - $order->discount;
                 }
            }
            $order->total_amount = max(0, $netTotal);
        }

        // Update Order as PAID
        $order->update([
            'payment_status' => 'paid',
            'payment_method' => $request->input('payment_method', 'cash'),
            'status' => 'served', // Ensure it's marked as served/completed
        ]);

        // Free the table
        $table->update([
            'status' => 'free',
            'current_order_id' => null,
            'waiter_name' => null // Clear waiter assignment too? Optional.
        ]);

        return redirect()->back()->with([
            'success' => 'Table settled and cleared!',
            'order' => $order->load('items') // Return order with items for receipt
        ]);
    }

    public function moveOrder(Request $request, $id)
    {
        $request->validate(['target_table_id' => 'required|exists:dining_tables,id']);

        $sourceTable = DiningTable::findOrFail($id);
        $targetTable = DiningTable::findOrFail($request->target_table_id);

        if (!$sourceTable->current_order_id) {
            return redirect()->back()->withErrors(['message' => 'Source table has no active order']);
        }

        $sourceOrder = $sourceTable->currentOrder;

        // CASE 1: Move to Free Table
        if (!$targetTable->current_order_id) {
            // Re-assign order to target table
            $sourceOrder->update(['dining_table_id' => $targetTable->id]);

            // Update Target Table
            $targetTable->update([
                'status' => 'occupied',
                'current_order_id' => $sourceOrder->id,
                'waiter_name' => $sourceTable->waiter_name,
                'reservation_name' => $sourceTable->reservation_name
            ]);

            // Clear Source Table
            $sourceTable->update([
                'status' => 'free',
                'current_order_id' => null,
                'waiter_name' => null,
                'reservation_name' => null
            ]);
        } 
        // CASE 2: Merge with Occupied Table
        else {
            $targetOrder = $targetTable->currentOrder;

            // Move items from source order to target order
            foreach ($sourceOrder->items as $item) {
                $item->update(['order_id' => $targetOrder->id]);
            }

            // Recalculate target order total
            // Reload items to get fresh sum
            $newTotal = $targetOrder->items()->sum(\Illuminate\Support\Facades\DB::raw('quantity * unit_price'));
            
            // Apply existing discount logic if needed (Assuming percentage for now or reset)
            // Ideally we should recalculate discount. For now, let's just update gross info and keep discount % if valid.
            if($targetOrder->discount_type == 'percentage') {
                 $netTotal = $newTotal - ($newTotal * ($targetOrder->discount / 100));
                 $targetOrder->update(['total_amount' => max(0, $netTotal)]);
            } else {
                 $targetOrder->update(['total_amount' => max(0, $newTotal - $targetOrder->discount)]);
            }

            // Delete the empty source order
            $sourceOrder->delete();

            // Clear Source Table
            $sourceTable->update([
                'status' => 'free',
                'current_order_id' => null,
                'waiter_name' => null,
                'reservation_name' => null
            ]);
        }

        return redirect()->back()->with('success', 'Table Moved/Merged Successfully');
    }
}
