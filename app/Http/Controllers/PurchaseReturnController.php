<?php

namespace App\Http\Controllers;

use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseReturnController extends Controller
{
    /**
     * Menampilkan daftar retur pembelian
     */
    public function index(Request $request)
    {
        $query = PurchaseReturn::with(['supplier', 'items.product']);

        // Fitur Pencarian berdasarkan No. Retur atau Nama Supplier
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('return_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($supplierQuery) use ($search) {
                        $supplierQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $purchaseReturns = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('PurchaseReturns/Index', [
            'purchaseReturns' => $purchaseReturns,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menampilkan form tambah retur pembelian
     */
    public function create()
    {
        // Pastikan eager loading 'purchaseOrders.items.product' dipanggil dengan benar
        $suppliers = Supplier::with(['purchaseOrders.items.product'])->get();

        return Inertia::render('PurchaseReturns/Create', [
            'suppliers' => $suppliers,
            'defaultReturnNumber' => 'PR-' . date('Ymd') . '-' . rand(1000, 9999),
        ]);
    }

    /**
     * Menyimpan data retur pembelian baru & memotong stok otomatis
     */
    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_order_id' => 'required|exists:purchase_orders,id', // <-- 1. Tambahkan validasi ini
            'return_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat Header Retur Pembelian
            $purchaseReturn = PurchaseReturn::create([
                'return_number' => $request->return_number ?? 'PR-' . date('Ymd') . '-' . rand(1000, 9999),
                'supplier_id' => $request->supplier_id,
                'purchase_order_id' => $request->purchase_order_id, // <-- 2. Masukkan ini agar tersimpan ke database
                'return_date' => $request->return_date,
                'reason' => $request->reason,
                'status' => 'completed',
            ]);

            // 2. Simpan Item Retur & Catat Mutasi Stok Keluar (OUT)
            foreach ($request->items as $item) {
                PurchaseReturnItem::create([
                    'purchase_return_id' => $purchaseReturn->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                // Kurangi stok produk secara langsung
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->decrement('stock', $item['quantity']);
                }

                // Catat ke Mutasi Stok (Stock Movement tipe OUT karena barang dikembalikan ke supplier)
                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'type' => 'OUT',
                    'quantity' => $item['quantity'],
                    'reference_number' => $purchaseReturn->return_number,
                ]);
            }
        });

        return redirect()->route('purchase-returns.index')
            ->with('success', 'Retur pembelian berbasis PO berhasil disimpan dan stok berhasil disesuaikan.');
    }
    /**
     * Menampilkan detail retur pembelian
     */
    public function show(PurchaseReturn $purchaseReturn)
    {
        $purchaseReturn->load(['supplier', 'purchaseOrder', 'items.product']);

        return Inertia::render('PurchaseReturns/Show', [
            'purchaseReturn' => $purchaseReturn,
        ]);
    }
}
