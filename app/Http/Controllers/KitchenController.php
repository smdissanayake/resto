<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function index()
    {
        // Fetch active orders (New, Cooking, Ready, Cancelled)
        $activeOrders = Order::whereIn('status', ['pending', 'preparing', 'completed', 'cancelled'])
            ->with(['items', 'diningTable'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($o) => $this->formatOrder($o));

        // Fetch History (Served) - Lazy loaded only when requested
        // Or we can just pass them if the list is small (last 20)
        $historyOrders = Inertia::lazy(fn() => 
            Order::where('status', 'served')
                ->with(['items', 'diningTable'])
                ->orderBy('updated_at', 'desc') // Most recently served first
                ->limit(20)
                ->get()
                ->map(fn($o) => $this->formatOrder($o))
        );

        return Inertia::render('KitchenDisplay', [
            'orders' => $activeOrders,
            'history' => $historyOrders
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Handle explicit "Undo" request OR simple toggle logic
        // If query param ?undo=true is passed
        if ($request->boolean('undo')) {
             if ($order->status === 'served') {
                 $order->update(['status' => 'completed']); // Bring back to Ready
             } elseif ($order->status === 'completed') {
                 $order->update(['status' => 'preparing']); // Bring back to Cooking
             } elseif ($order->status === 'preparing') {
                $order->update(['status' => 'pending']); // Bring back to New
            }
             return redirect()->back();
        }

        // Forward State Machine
        $newStatus = 'pending';
        
        if ($order->status === 'pending') {
            $newStatus = 'preparing';
        } elseif ($order->status === 'preparing') {
            $newStatus = 'completed';
        } elseif ($order->status === 'completed') {
            $newStatus = 'served'; // Archive
        } elseif ($order->status === 'cancelled') {
             $newStatus = 'cancelled_archived'; // Hide from board
        }

        $order->update(['status' => $newStatus]);

        return redirect()->back();
    }

    // Extracted formatter to avoid duplication
    private function formatOrder($order) {
        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'tableNo' => $order->diningTable ? $order->diningTable->name : 'Takeaway',
            'status' => $this->mapStatusToFrontend($order->status),
            'startTime' => $order->created_at->toIso8601String(),
            'serverName' => 'Staff',
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'modifiers' => $item->modifiers ? $this->formatModifiers($item->modifiers) : []
                ];
            })
        ];
    }

    // Helper to map DB status to Frontend UI status
    private function mapStatusToFrontend($dbStatus)
    {
        switch ($dbStatus) {
            case 'pending': return 'New';
            case 'preparing': return 'Cooking';
            case 'completed': return 'Ready';
            case 'cancelled': return 'cancelled';
            case 'served': return 'History'; // Frontend label for served items
            default: return 'New';
        }
    }

    // Helper to format modifiers for display
    private function formatModifiers($modifiers)
    {
        // Assuming modifiers is array or JSON. 
        // Example: {'size': 'L', 'addons': ['Cheese']}
        $list = [];
        if (is_array($modifiers)) {
            if (isset($modifiers['size'])) $list[] = $modifiers['size'];
            if (isset($modifiers['addons']) && is_array($modifiers['addons'])) {
                $list = array_merge($list, $modifiers['addons']);
            }
        }
        return $list;
    }
}
