<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use App\Models\Supplier; // Import model Supplier
use App\Models\PurchasePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'items.product'])->latest()->paginate(10);

        return Inertia::render('PurchaseOrders/Index', [
            'purchaseOrders' => $purchaseOrders,
        ]);
    }

    public function create()
    {
        $suppliers = Supplier::all(); // Ambil semua data supplier dari database
        $products = Product::all();

        return Inertia::render('PurchaseOrders/Create', [
            'suppliers' => $suppliers, // Kirim ke React
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id'        => 'required|exists:suppliers,id',
            'order_date'         => 'required|date',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.unit_cost'  => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $poNumber = 'PO-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            // 1. Ubah status awal PO menjadi 'ordered' (belum completed)
            // Buat PO dengan status awal 'draft' (sesuai ENUM database)
            $po = PurchaseOrder::create([
                'po_number'   => $poNumber,
                'supplier_id' => $request->supplier_id,
                'order_date'  => $request->order_date,
                'status'      => 'draft',
            ]);
            foreach ($request->items as $item) {
                $subtotal = $item['quantity'] * $item['unit_cost'];

                // 2. Simpan item PO saja tanpa menyentuh stok produk
                $po->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_cost'  => $item['unit_cost'],
                    'subtotal'   => $subtotal,
                ]);

                // NOTE: Perintah increment stok & StockMovement DIHAPUS dari sini, 
                // karena nanti stok baru akan bertambah saat Goods Receipt (GR) dibuat!
            }
        });

        return redirect()->route('purchase-orders.index')->with('message', 'Purchase Order berhasil dibuat (Menunggu Penerimaan Barang/GR).');
    }
    public function show($id)
    {
        $purchaseOrder = PurchaseOrder::with(['supplier', 'items.product'])->findOrFail($id);

        return Inertia::render('PurchaseOrders/Show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }


    // Tambahkan function ini di dalam Controller PO:
    public function storePayment(Request $request, $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $po = \App\Models\PurchaseOrder::findOrFail($id);

        // Simpan history pembayaran
        PurchasePayment::create([
            'purchase_order_id' => $po->id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
        ]);

        // Update status pembayaran & total bayar di PO secara otomatis
        $po->updatePaymentStatus();

        return redirect()->back()->with('success', 'Pembayaran berhasil dicatatkan!');
    }
}
