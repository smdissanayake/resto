<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Products Table (Menu Items)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->string('category')->index(); // e.g., 'Burgers', 'Pizza'
            $table->string('image')->nullable();
            $table->string('description')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g., ORD-1001
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'preparing', 'completed', 'cancelled'])->default('pending');
            $table->string('payment_method')->default('cash'); // 'cash', 'card'
            $table->timestamps();
        });

        // Order Items Table (Pivot)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null'); // Keep record even if product deleted
            $table->string('product_name'); // Snapshot of name
            $table->integer('quantity');
            $table->decimal('unit_price', 8, 2); // Snapshot of price at time of order
            $table->json('modifiers')->nullable(); // Store size, addons as JSON: {size: 'medium', addons: ['cheese', 'bacon']}
            $table->text('special_instructions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
    }
};
