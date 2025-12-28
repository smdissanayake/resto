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
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid'])->default('unpaid')->after('status');
            // We already have payment_method but let's ensure it's nullable or modify it if needed.
            // Actually early migration showed payment_method default 'cash'.
            // Let's modify it to be nullable if we want, or just leave it. 
            // Wait, previous migration said: $table->string('payment_method')->default('cash');
            // So we don't need to add it, maybe just ensure payment_status is added.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status']);
        });
    }
};
