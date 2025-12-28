<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure we have Products & Categories
        // Check if products exist, if not create some
        if (Product::count() === 0) {
            $categories = ['Burgers', 'Drinks', 'Sides', 'Desserts'];
            
            $products = [
                ['name' => 'Classic Burger', 'price' => 12.50, 'category' => 'Burgers'],
                ['name' => 'Cheese Burger', 'price' => 14.00, 'category' => 'Burgers'],
                ['name' => 'Mega Burger', 'price' => 18.00, 'category' => 'Burgers'],
                ['name' => 'Cola', 'price' => 3.00, 'category' => 'Drinks'],
                ['name' => 'Iced Coffee', 'price' => 4.50, 'category' => 'Drinks'],
                ['name' => 'French Fries', 'price' => 5.00, 'category' => 'Sides'],
                ['name' => 'Onion Rings', 'price' => 6.00, 'category' => 'Sides'],
                ['name' => 'Chocolate Cake', 'price' => 7.00, 'category' => 'Desserts'],
            ];

            foreach ($products as $p) {
                Product::create($p);
            }
        }

        $allProducts = Product::all();

        // 2. Clear existing orders to avoid duplicates IF needed (optional, maybe skip)
        // Order::truncate(); 
        // OrderItem::truncate();

        // 3. Generate Orders for specific ranges
        // TODAY
        $this->createOrders(10, Carbon::today());
        
        // YESTERDAY
        $this->createOrders(15, Carbon::yesterday());

        // THIS WEEK (Random days)
        $this->createOrders(20, Carbon::now()->subDays(3));

        // THIS MONTH
        $this->createOrders(30, Carbon::now()->subDays(15));
    }

    private function createOrders($count, $dateBase)
    {
        $products = Product::all();
        $users = \App\Models\User::all(); // Fetch all users

        for ($i = 0; $i < $count; $i++) {
            // Random time within the day
            $orderDate = $dateBase->copy()->setHour(rand(10, 22))->setMinute(rand(0, 59));

            // Create Order
            $order = Order::create([
                'order_number' => 'ORD-' . uniqid(),
                'total_amount' => 0, // Will calc below
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => rand(0, 1) ? 'cash' : 'card',
                'user_id' => $users->isNotEmpty() ? $users->random()->id : null, // Assign Random User
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            // Add Items
            $itemCount = rand(1, 4);
            $total = 0;

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $qty = rand(1, 3);
                $price = $product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $qty,
                    'unit_price' => $price,
                ]);

                $total += ($qty * $price);
            }

            // Update Total
            $order->update(['total_amount' => $total]);
        }
    }
}
