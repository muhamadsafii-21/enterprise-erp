<?php

namespace App\Http\Controllers;

use App\Models\GoodsReceipt;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GoodsReceiptController extends Controller
{
    // List Goods Receipt
    public function index()
    {
        $goodsReceipts = GoodsReceipt::with(['purchaseOrder', 'supplier'])->latest()->get();

        return Inertia::render('GoodsReceipts/Index', [
            'goodsReceipts' => $goodsReceipts,
        ]);
    }

    // Form Tambah Goods Receipt Baru
    // Form Tambah Goods Receipt Baru
    public function create()
    {
        // Ambil PO yang statusnya masih 'draft' beserta detail items dan produknya
        $purchaseOrders = PurchaseOrder::where('status', 'draft')
            ->with(['supplier', 'items.product'])
            ->get();

        $suppliers = Supplier::all();
        $products = Product::all();

        return Inertia::render('GoodsReceipts/Create', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }
    // Simpan Goods Receipt & Otomatis Tambah Stok Produk
    public function store(Request $request)
    {
        $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'received_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // DB Transaction untuk menjamin integritas data
        DB::transaction(function () use ($request) {
            // Auto-generate Nomor GR (Contoh: GR-20260809-XXXX)
            $grNumber = 'GR-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            // 1. Simpan Data Goods Receipt
            $gr = GoodsReceipt::create([
                'gr_number' => $grNumber,
                'purchase_order_id' => $request->purchase_order_id,
                'supplier_id' => $request->supplier_id,
                'received_date' => $request->received_date,
                'status' => 'received',
            ]);

            // 2. Loop setiap item barang yang diterima
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Tambah jumlah stok di tabel products
                $product->increment('stock', $item['quantity']);

                // Catat di riwayat pergerakan stok (StockMovement)
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'IN', // Disamakan kapitalnya agar konsisten
                    'quantity' => $item['quantity'],
                    'reference_number' => $grNumber,
                    'notes' => 'Penerimaan barang dari Goods Receipt (' . $grNumber . ')',
                ]);
            }

            // 3. Update status Purchase Order menjadi 'completed'
            $purchaseOrder = PurchaseOrder::findOrFail($request->purchase_order_id);
            $purchaseOrder->update([
                'status' => 'completed'
            ]);
        });

        return redirect()->route('goods-receipts.index')->with('success', 'Goods Receipt berhasil dibuat, stok bertambah, dan PO selesai!');
    }
}
