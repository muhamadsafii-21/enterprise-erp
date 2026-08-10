<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_orders', function (Blueprint $table) {
            $table->id();
            $table->string('do_number')->unique(); // Contoh: DO-20260810-0001
            $table->foreignId('sales_order_id')->constrained('sales_orders')->onDelete('cascade');
            $table->date('delivery_date');
            $table->enum('status', ['draft', 'shipped', 'delivered', 'cancelled'])->default('draft');
            $table->text('shipping_address')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('vehicle_number')->nullable(); // Plat Nomor Kendaraan
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_orders');
    }
};
