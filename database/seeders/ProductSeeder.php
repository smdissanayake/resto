<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Burgers
            [
                'name' => 'Classic Smash Burger',
                'price' => 12.99,
                'category' => 'Burgers',
                'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Double Bacon Deluxe',
                'price' => 15.99,
                'category' => 'Burgers',
                'image' => 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Mushroom Swiss',
                'price' => 14.49,
                'category' => 'Burgers',
                'image' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Spicy Jalapeño',
                'price' => 13.99,
                'category' => 'Burgers',
                'image' => 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Veggie Supreme',
                'price' => 11.99,
                'category' => 'Burgers',
                'image' => 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop'
            ],
            // Pizza
            [
                'name' => 'Margherita Classic',
                'price' => 14.99,
                'category' => 'Pizza',
                'image' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Pepperoni Feast',
                'price' => 16.99,
                'category' => 'Pizza',
                'image' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'BBQ Chicken',
                'price' => 17.99,
                'category' => 'Pizza',
                'image' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'
            ],
            // Salads
            [
                'name' => 'Caesar Salad',
                'price' => 10.99,
                'category' => 'Salads',
                'image' => 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Greek Salad',
                'price' => 11.99,
                'category' => 'Salads',
                'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop'
            ],
            // Drinks
            [
                'name' => 'Craft Cola',
                'price' => 2.99,
                'category' => 'Drinks',
                'image' => 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Fresh Lemonade',
                'price' => 3.49,
                'category' => 'Drinks',
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Iced Coffee',
                'price' => 3.99,
                'category' => 'Drinks',
                'image' => 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop'
            ],
            // Desserts
            [
                'name' => 'Chocolate Lava Cake',
                'price' => 7.99,
                'category' => 'Desserts',
                'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=400&h=400&fit=crop'
            ],
            [
                'name' => 'Vanilla Bean Ice Cream',
                'price' => 5.99,
                'category' => 'Desserts',
                'image' => 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=400&fit=crop'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
