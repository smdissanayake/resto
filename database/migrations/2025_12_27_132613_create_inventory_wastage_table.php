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
        Schema::create('inventory_wastage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity', 10, 4);
            $table->string('reason'); // e.g., 'Expired', 'Damaged', 'Spilled'
            $table->text('notes')->nullable();
            $table->decimal('cost', 10, 2); // Cost at the time of wastage
            $table->foreignId('user_id')->constrained(); // Who reported it
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_wastage');
    }
};
