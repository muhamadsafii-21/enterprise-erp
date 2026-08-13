<?php

namespace App\Http\Controllers;

use App\Models\SalesReturn;
use App\Models\SalesReturnItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesReturnController extends Controller
{
    public function index(Request $request)
    {
        $query = SalesReturn::with(['customer', 'items.product']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('return_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $salesReturns = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('SalesReturns/Index', [
            'salesReturns' => $salesReturns,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Mengambil data customer beserta Sales Orders dan item produknya
        $customers = Customer::with(['salesOrders.items.product'])->get();

        return Inertia::render('SalesReturns/Create', [
            'customers' => $customers,
            'defaultReturnNumber' => 'SR-' . date('Ymd') . '-' . rand(1000, 9999),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'sales_order_id' => 'required|exists:sales_orders,id',
            'return_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $salesReturn = SalesReturn::create([
                'return_number' => $request->return_number ?? 'SR-' . date('Ymd') . '-' . rand(1000, 9999),
                'customer_id' => $request->customer_id,
                'sales_order_id' => $request->sales_order_id,
                'return_date' => $request->return_date,
                'reason' => $request->reason,
                'status' => 'completed',
            ]);

            foreach ($request->items as $item) {
                SalesReturnItem::create([
                    'sales_return_id' => $salesReturn->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                // STOK BERTAMBAH KEMBALI (IN) karena barang diretur oleh customer
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->increment('stock', $item['quantity']);
                }

                // Catat ke Mutasi Stok (Tipe IN)
                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'type' => 'IN',
                    'quantity' => $item['quantity'],
                    'reference_number' => $salesReturn->return_number,
                ]);
            }
        });

        return redirect()->route('sales-returns.index')
            ->with('success', 'Retur penjualan berhasil disimpan dan stok bertambah kembali.');
    }

    public function show(SalesReturn $salesReturn)
    {
        $salesReturn->load(['customer', 'salesOrder', 'items.product']);

        return Inertia::render('SalesReturns/Show', [
            'salesReturn' => $salesReturn,
        ]);
    }
}
