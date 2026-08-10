<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    /**
     * Menampilkan daftar transaksi Sales Order
     */
    public function index()
    {
        $salesOrders = SalesOrder::with('customer')
            ->latest()
            ->paginate(10);

        return Inertia::render('SalesOrders/Index', [
            'salesOrders' => $salesOrders
        ]);
    }

    /**
     * Menampilkan form buat Sales Order baru
     */
    public function create()
    {
        $customers = Customer::select('id', 'name', 'phone', 'address')->get();

        $products = Product::where('stock', '>', 0)
            ->select('id', 'name', 'stock', 'sell_price')
            ->get();

        return Inertia::render('SalesOrders/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    /**
     * Menyimpan transaksi Sales Order (TANPA MEMOTONG STOK)
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id'       => 'required|exists:customers,id',
            'order_date'        => 'required|date',
            'items'             => 'required|array|min:1',
            'items.*.product_id'   => 'required|exists:products,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.unit_price'   => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $dateCode = now()->format('Ym');
            $lastOrder = SalesOrder::where('order_number', 'like', "SO-{$dateCode}-%")
                ->orderBy('id', 'desc')
                ->first();

            $nextNumber = $lastOrder ? ((int) substr($lastOrder->order_number, -4)) + 1 : 1;
            $orderNumber = "SO-{$dateCode}-" . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            $totalAmount = 0;
            foreach ($request->items as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }

            // 1. Simpan Header Sales Order (Status: PENDING / Menunggu Pengiriman)
            $salesOrder = SalesOrder::create([
                'order_number'  => $orderNumber,
                'order_date'    => $request->order_date,
                'customer_id'   => $request->customer_id,
                'total_amount'  => $totalAmount,
                'status'        => 'PENDING',
            ]);

            // 2. Simpan Item Sales Order (MURNI PENCATATAN PESANAN)
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Opsional: Cek apakah stok sistem mencukupi untuk dipesan (tapi stok TIDAK DIKURANGI dulu)
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok untuk produk {$product->name} tidak mencukupi.");
                }

                $subtotal = $item['quantity'] * $item['unit_price'];

                SalesOrderItem::create([
                    'sales_order_id' => $salesOrder->id,
                    'product_id'     => $product->id,
                    'quantity'       => $item['quantity'],
                    'unit_price'     => $item['unit_price'],
                    'subtotal'       => $subtotal,
                ]);

                // ❌ KODE PEMOTONGAN STOK DAN STOCK MOVEMENT DIHAPUS DARI SINI
                // Karena stok & stock movement baru akan dieksekusi saat membuat Delivery Order (DO)
            }
        });

        return redirect()->route('sales-orders.index')
            ->with('message', 'Sales Order berhasil dibuat. Silakan buat Surat Jalan (DO) untuk mengeluarkan barang.');
    }

    /**
     * Menampilkan Detail Sales Order
     */
    public function show($id)
    {
        $salesOrder = SalesOrder::with(['customer', 'items.product'])->findOrFail($id);

        return Inertia::render('SalesOrders/Show', [
            'salesOrder' => $salesOrder,
        ]);
    }
}
