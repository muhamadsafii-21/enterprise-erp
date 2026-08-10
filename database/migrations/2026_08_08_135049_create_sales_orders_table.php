<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // contoh: SO-202608-0001
            $table->date('order_date');
            $table->string('customer_name')->default('General Customer');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->enum('status', ['COMPLETED', 'CANCELLED'])->default('COMPLETED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_orders');
    }
};
