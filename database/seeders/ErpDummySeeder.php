<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\GoodsReceipt;
use App\Models\PurchaseInvoice;
use App\Models\Product;
use App\Models\StockMovement;

class ErpDummySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Data Supplier Realistis
        $supplier = Supplier::updateOrCreate(
            ['code' => 'SUP-001'],
            [
                'name' => 'PT. Material Utama Jaya',
                'phone' => '081234567890',
                'address' => 'Jl. Industri No. 45, Jakarta'
            ]
        );

        // 2. Data Master Produk Material Realistis
        $semen = Product::updateOrCreate(
            ['code' => 'PRD-001'],
            [
                'name' => 'Semen Gresik 50kg',
                'category' => 'Material Utama',
                'unit' => 'sak',
                'buy_price' => 65000,
                'sell_price' => 75000,
                'stock' => 100,
                'min_stock' => 20,
            ]
        );

        $besi = Product::updateOrCreate(
            ['code' => 'PRD-002'],
            [
                'name' => 'Besi Beton 10mm Ulir',
                'category' => 'Besi & Baja',
                'unit' => 'batang',
                'buy_price' => 85000,
                'sell_price' => 98000,
                'stock' => 8, // Set di bawah min_stock (15) untuk simulasi Alert Stok Menipis
                'min_stock' => 15,
            ]
        );

        $cat = Product::updateOrCreate(
            ['code' => 'PRD-003'],
            [
                'name' => 'Cat Tembok Nippon Paint 20kg',
                'category' => 'Finishing',
                'unit' => 'pail',
                'buy_price' => 550000,
                'sell_price' => 620000,
                'stock' => 25,
                'min_stock' => 5,
            ]
        );

        // 3. Document 1: Purchase Order (Pesanan Pembelian)
        $po = PurchaseOrder::updateOrCreate(
            ['po_number' => 'PO-2026/08/001'],
            [
                'supplier_id' => $supplier->id,
                'order_date' => '2026-08-01',
                'status' => 'approved'
            ]
        );

        // 4. Document 2: Goods Receipt (Penerimaan Barang di Gudang)
        $gr = GoodsReceipt::updateOrCreate(
            ['gr_number' => 'GR-2026/08/001'],
            [
                'purchase_order_id' => $po->id,
                'supplier_id' => $supplier->id,
                'received_date' => '2026-08-05',
                'status' => 'received'
            ]
        );

        // 5. Stock Movement Log (Riwayat Masuknya Stok)
        StockMovement::updateOrCreate(
            ['reference_number' => 'GR-2026/08/001', 'product_id' => $semen->id],
            [
                'type' => 'in',
                'quantity' => 100,
                'notes' => 'Penerimaan barang dari PT. Material Utama Jaya',
            ]
        );

        StockMovement::updateOrCreate(
            ['reference_number' => 'GR-2026/08/001', 'product_id' => $besi->id],
            [
                'type' => 'in',
                'quantity' => 8,
                'notes' => 'Penerimaan barang dari PT. Material Utama Jaya',
            ]
        );
        // 6. Document 3: Purchase Invoice & Item (Tagihan Pembelian)
        $invoice = PurchaseInvoice::updateOrCreate(
            ['invoice_number' => 'INV-202608-0001'],
            [
                'goods_receipt_id' => $gr->id,
                'supplier_id'      => $supplier->id,
                'invoice_date'     => '2026-08-06',
                'due_date'         => '2026-08-20',
                'subtotal'         => 7180000,
                'discount'         => 0,
                'tax'              => 789800, // PPN 11%
                'grand_total'      => 7969800,
                'status'           => 'unpaid',
            ]
        );

        // Detail Item Tagihan (Mengacu pada barang yang diterima dari Goods Receipt)
        \App\Models\PurchaseInvoiceItem::updateOrCreate(
            ['purchase_invoice_id' => $invoice->id, 'item_name' => 'Semen Gresik 50kg'],
            [
                'quantity'    => 100,
                'unit_price'  => 65000,
                'total_price' => 6500000,
            ]
        );

        \App\Models\PurchaseInvoiceItem::updateOrCreate(
            ['purchase_invoice_id' => $invoice->id, 'item_name' => 'Besi Beton 10mm Ulir'],
            [
                'quantity'    => 8,
                'unit_price'  => 85000,
                'total_price' => 680000,
            ]
        );
    }
}
