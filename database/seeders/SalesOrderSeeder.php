<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalesOrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // Ambil produk pertama dari database
            $product = Product::first();

            if (!$product) {
                return;
            }

            // Generate Nomor Order Dinamis (Cek urutan nomor terakhir)
            $dateCode = now()->format('Ym');
            $lastOrder = SalesOrder::where('order_number', 'like', "SO-{$dateCode}-%")
                ->orderBy('id', 'desc')
                ->first();

            $nextNumber = $lastOrder ? ((int) substr($lastOrder->order_number, -4)) + 1 : 1;
            $orderNumber = "SO-{$dateCode}-" . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            $qtyToSell = 2;
            $unitPrice = $product->price ?? 15000;
            $totalAmount = $qtyToSell * $unitPrice;

            // 1. Buat Header Sales Order
            $salesOrder = SalesOrder::create([
                'order_number'  => $orderNumber, // <-- Menggunakan nomor dinamis
                'order_date'    => now()->format('Y-m-d'),
                'customer_name' => 'Toko Sumber Makmur',
                'total_amount'  => $totalAmount,
                'status'        => 'COMPLETED',
            ]);

            // 2. Buat Item Sales Order
            SalesOrderItem::create([
                'sales_order_id' => $salesOrder->id,
                'product_id'     => $product->id,
                'quantity'       => $qtyToSell,
                'unit_price'     => $unitPrice,
                'subtotal'       => $totalAmount,
            ]);

            // 3. Potong Stok Produk
            $product->decrement('stock', $qtyToSell);

            // 4. Catat Mutasi Stok (OUT)
            StockMovement::create([
                'product_id'       => $product->id,
                'type'             => 'OUT',
                'quantity'         => $qtyToSell,
                'reference_number' => $salesOrder->order_number,
            ]);
        });
    }
}
