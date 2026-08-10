<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('purchase_payments')) {
            Schema::create('purchase_payments', function (Blueprint $table) {
                $table->id();
                // Diubah ke purchase_invoice_id
                $table->foreignId('purchase_invoice_id')->constrained('purchase_invoices')->onDelete('cascade');
                $table->decimal('amount', 15, 2);
                $table->date('payment_date');
                $table->string('payment_method')->default('Transfer');
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        // Tambah kolom paid_amount di purchase_invoices jika belum ada
        Schema::table('purchase_invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('purchase_invoices', 'paid_amount')) {
                $table->decimal('paid_amount', 15, 2)->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('purchase_invoices', function (Blueprint $table) {
            $table->dropColumn(['paid_amount']);
        });
        Schema::dropIfExists('purchase_payments');
    }
};
