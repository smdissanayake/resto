<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::where('is_available', true)->get();
        $tables = \App\Models\DiningTable::all();
        
        // Fetch Pending Takeaway Orders (Not assigned to a table, status is pending or preparing)
        // These are the 'Open Orders' for takeaway
        $pendingOrders = Order::whereNull('dining_table_id')
            ->whereIn('status', ['pending', 'preparing'])
            ->where('payment_status', '!=', 'paid') // Only show unpaid orders (Held orders)
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('POSInterface', [
            'products' => $products,
            'tables' => $tables,
            'pendingOrders' => $pendingOrders,
            'tableId' => $request->query('table_id') // Pass query param to frontend
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'dining_table_id' => 'nullable|exists:dining_tables,id',
            'order_id' => 'nullable|exists:orders,id', // Support specific order update
        ]);

        try {
            DB::beginTransaction();

            $order = null;

            // 1. Try to find existing order to update via ID (Explicit update for Takeaway/Recall)
            if (!empty($validated['order_id'])) {
                $order = Order::find($validated['order_id']);
            } 
            // 2. Or find by Table (Implicit update for Dine-in)
            else if (!empty($validated['dining_table_id'])) {
                $table = \App\Models\DiningTable::find($validated['dining_table_id']);
                if ($table && $table->status === 'occupied' && $table->current_order_id) {
                    $order = Order::find($table->current_order_id);
                    // Ensure the order is not already paid
                    if ($order && $order->payment_status === 'paid') {
                        $order = null; 
                    }
                }
            }

            // Determine Payment Status
            $isPaidInfo = in_array($validated['payment_method'], ['cash', 'card', 'qr']);
            $paymentStatus = $isPaidInfo ? 'paid' : 'unpaid';

            // 3. Create new Order if not found
            if (!$order) {
                // Initial status is pending unless specified otherwise
                $order = Order::create([
                    'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                    'total_amount' => 0, 
                    'status' => 'pending',
                    'payment_status' => $paymentStatus, 
                    'payment_method' => $validated['payment_method'],
                    'dining_table_id' => $validated['dining_table_id'] ?? null,
                    'discount' => $request->input('discount', 0),
                    'discount_type' => $request->input('discount_type', 'percentage'),
                ]);

                // Update Table Status if applicable
                if (!empty($validated['dining_table_id'])) {
                     $table = \App\Models\DiningTable::find($validated['dining_table_id']);
                     if ($table) {
                         $table->update([
                             'status' => 'occupied',
                             'current_order_id' => $order->id
                         ]);
                     }
                }
            } else {
                // Update existing order allow fields
                if ($request->has('discount')) {
                    $order->discount = $request->input('discount', 0);
                    $order->discount_type = $request->input('discount_type', 'percentage');
                }
                // Update payment method & status if changed (e.g. from pending to cash)
                if ($validated['payment_method'] !== 'pending') {
                    $order->payment_method = $validated['payment_method'];
                    if ($isPaidInfo) {
                        $order->payment_status = 'paid';
                    }
                }
                $order->save();
            }

            // Calculation Logic
            // Note: For simplicity, we are appending items. 
            // If this is a 'Resave' of a recalled order, you might expect it to replace.
            // But usually POS adds. To avoid complexity of diffing, we just ADD the items sent.
            // IMPORTANT: Frontend must clear cart after sending. 
            // If Frontend recalls order, it should only send NEW items or we must clear old ones?
            // BETTER APPROACH for Unified System: 
            // If 'order_id' is passed, it means we are editing. 
            // If we blindly add, we duplicate. 
            // Let's rely on frontend sending ONLY NEW items? 
            // OR: We delete all items and recreate? (Heavy but safe for equality)
            // Let's go with APPEND for now. Frontend should calculate what is new.
            // actually, the standard POS flow is "Add to ticket".
            
            $currentTotal = $order->total_amount;
            $newItemsTotal = 0;

            foreach ($request->items as $itemData) {
                // Handle ID strings 'b1-timestamp'
                $rawId = $itemData['product_id'] ?? $itemData['id'];
                $prodId = $rawId;
                if (str_contains((string)$rawId, '-')) {
                    $parts = explode('-', (string)$rawId);
                    $prodId = $parts[0];
                }
                
                $product = Product::find($prodId); 
                
                if ($product) {
                    $price = $product->price;
                    
                    // Inventory Logic
                    if ($product->type === 'retail') {
                        $product->decrement('stock_quantity', $itemData['quantity']);
                    } else if ($product->type === 'kitchen') {
                        // 1. Deduct Recipe Ingredients
                        $product->load('ingredients');
                        foreach ($product->ingredients as $ingredient) {
                            $factor = $ingredient->conversion_factor > 0 ? $ingredient->conversion_factor : 1;
                            // Ingredient pivot quantity is in Usage Unit (e.g. 150g)
                            // We need to convert to Main Unit (Stock Unit)
                            $deductionAmount = ($ingredient->pivot->quantity * $itemData['quantity']) / $factor;
                            $ingredient->decrement('stock_level', $deductionAmount);
                        }

                        // 2. Deduct Modifier Ingredients
                        // We need to look up the modifier definition in the Product to find linked inventory items
                        $modifiersData = $itemData['modifiers'] ?? null;
                        if ($modifiersData && !empty($product->modifiers)) {
                             // Helper to flatten selected modifiers into a list of names/options
                             $selectedOptions = [];
                             if (isset($modifiersData['size']) && is_string($modifiersData['size'])) $selectedOptions[] = $modifiersData['size'];
                             if (isset($modifiersData['addons']) && is_array($modifiersData['addons'])) {
                                 $selectedOptions = array_merge($selectedOptions, $modifiersData['addons']);
                             }

                             // Loop through product's modifier definitions to find matches
                             foreach ($product->modifiers as $group) {
                                 foreach ($group['options'] as $option) {
                                     // Check if this option was selected AND has linked inventory
                                     if (in_array($option['name'], $selectedOptions)) {
                                         if (!empty($option['inventory_item_id']) && !empty($option['quantity'])) {
                                             $inventoryItem = \App\Models\InventoryItem::find($option['inventory_item_id']);
                                             if ($inventoryItem) {
                                                 $factor = $inventoryItem->conversion_factor > 0 ? $inventoryItem->conversion_factor : 1;
                                                 $deduction = ($option['quantity'] * $itemData['quantity']) / $factor; 
                                                 $inventoryItem->decrement('stock_level', $deduction);
                                             }
                                         }
                                     }
                                 }
                             }
                        }
                    }

                    $finalUnitPrice = $price + $this->calculateModifiersPrice($product, $itemData['modifiers'] ?? null);
                    $lineTotal = $finalUnitPrice * $itemData['quantity'];
                    $newItemsTotal += $lineTotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $finalUnitPrice, 
                        'modifiers' => $itemData['modifiers'] ?? null,
                        'special_instructions' => $itemData['specialInstructions'] ?? null,
                    ]);
                }
            }

            // Recalculate Total from DB (safest)
            $grossTotal = $order->items()->sum(DB::raw('quantity * unit_price'));
            
            // Re-apply discount
            $orderDiscount = $order->discount;
            $orderDiscountType = $order->discount_type;
            
            $netTotal = $grossTotal;
            if ($orderDiscount > 0) {
                 if ($orderDiscountType === 'percentage') {
                     $netTotal = $grossTotal - ($grossTotal * ($orderDiscount / 100));
                 } else {
                     $netTotal = $grossTotal - $orderDiscount; 
                 }
            }

            $order->update(['total_amount' => max(0, $netTotal)]);
            
            // If order was served/completed, move back to preparing if new items added (KDS update)
            if (in_array($order->status, ['completed', 'served'])) {
                 $order->update(['status' => 'preparing']);
            }

            DB::commit();

            return redirect()->back()->with([
                'success' => 'Order processed successfully!',
                'order' => $order->load('items') 
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to process order: ' . $e->getMessage());
        }
    }

    public function cancel($id)
    {
        try {
            DB::beginTransaction();
            $order = Order::findOrFail($id);

            // Update status to Cancelled (KDS will show this)
            $order->update(['status' => 'cancelled']);

            // If Table Order, Free the table
            if ($order->dining_table_id) {
                $table = \App\Models\DiningTable::find($order->dining_table_id);
                if ($table) {
                    $table->update([
                        'status' => 'free',
                        'current_order_id' => null
                    ]);
                }
            }

            // Note: Ideally we should restore inventory here.

            DB::commit();
            return redirect()->back()->with('success', 'Order Cancelled Successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to cancel order');
        }
    }

    private function calculateModifiersPrice(Product $product, $modifiersData): float
    {
        if (!is_array($modifiersData)) {
            return 0.0;
        }

        $modifiersPrice = 0.0;
        $productModifiers = $product->modifiers ?? [];

        if (isset($modifiersData['size']) && is_string($modifiersData['size'])) {
            $modifiersPrice += $this->findOptionPrice($productModifiers, 'size', $modifiersData['size']);
        }

        if (isset($modifiersData['addons']) && is_array($modifiersData['addons'])) {
            foreach ($modifiersData['addons'] as $addonName) {
                $modifiersPrice += $this->findOptionPrice($productModifiers, 'addon', $addonName);
            }
        }

        return $modifiersPrice;
    }

    private function findOptionPrice(array $modifierGroups, string $type, string $optionName): float
    {
        foreach ($modifierGroups as $group) {
            foreach ($group['options'] ?? [] as $option) {
                if ($option['name'] === $optionName) {
                    return (float)($option['price'] ?? 0);
                }
            }
        }
        return 0.0;
    }
}
