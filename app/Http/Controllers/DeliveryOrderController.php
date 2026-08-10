<?php

namespace App\Http\Controllers;

use App\Models\DeliveryOrder;
use App\Models\DeliveryOrderItem;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeliveryOrderController extends Controller
{
    public function index()
    {
        $deliveryOrders = DeliveryOrder::with(['salesOrder.customer', 'items.product'])
            ->latest()
            ->paginate(10);

        return Inertia::render('DeliveryOrders/Index', [
            'deliveryOrders' => $deliveryOrders
        ]);
    }

    public function create()
    {
        $salesOrders = SalesOrder::with('customer')->get();

        return Inertia::render('DeliveryOrders/Create', [
            'salesOrders' => $salesOrders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'sales_order_id' => 'required|exists:sales_orders,id',
            'delivery_date' => 'required|date',
            'driver_name' => 'nullable|string|max:255',
            'vehicle_number' => 'nullable|string|max:255',
            'shipping_address' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // Ambil Sales Order beserta item-item produk di dalamnya
            $salesOrder = SalesOrder::with('items')->findOrFail($request->sales_order_id);

            // 1. Update status Sales Order otomatis jadi PROCESSING saat DO dibuat
            $salesOrder->update([
                'status' => 'PROCESSING'
            ]);

            // 2. Generate Nomor DO otomatis
            $dateCode = date('Ymd');
            $lastDo = DeliveryOrder::whereDate('created_at', today())->latest()->first();
            $nextNumber = $lastDo ? ((int) substr($lastDo->do_number, -4)) + 1 : 1;
            $doNumber = 'DO-' . $dateCode . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            // 3. Simpan Header Delivery Order
            $deliveryOrder = DeliveryOrder::create([
                'do_number' => $doNumber,
                'sales_order_id' => $request->sales_order_id,
                'delivery_date' => $request->delivery_date,
                'status' => 'shipped',
                'shipping_address' => $request->shipping_address ?? $salesOrder->shipping_address,
                'driver_name' => $request->driver_name,
                'vehicle_number' => $request->vehicle_number,
                'notes' => $request->notes,
            ]);

            // 4. Loop item dari Sales Order secara otomatis
            foreach ($salesOrder->items as $soItem) {
                DeliveryOrderItem::create([
                    'delivery_order_id' => $deliveryOrder->id,
                    'product_id' => $soItem->product_id,
                    'quantity_shipped' => $soItem->quantity,
                ]);

                // Kurangi stok produk di tabel products
                $product = Product::findOrFail($soItem->product_id);
                $product->decrement('stock', $soItem->quantity);

                // Catat ke Stock Movements
                StockMovement::create([
                    'product_id' => $soItem->product_id,
                    'type' => 'OUT',
                    'quantity' => $soItem->quantity,
                    'reference_number' => $deliveryOrder->do_number,
                    'notes' => 'Pengiriman barang via Delivery Order ' . $deliveryOrder->do_number,
                ]);
            }
        });

        return redirect()->route('delivery-orders.index')->with('success', 'Surat Jalan (DO) berhasil dibuat, status Sales Order diperbarui, dan stok gudang telah dikurangi.');
    }

    public function show(DeliveryOrder $deliveryOrder)
    {
        $deliveryOrder->load(['salesOrder.customer', 'items.product']);

        return Inertia::render('DeliveryOrders/Show', [
            'deliveryOrder' => $deliveryOrder
        ]);
    }
}
