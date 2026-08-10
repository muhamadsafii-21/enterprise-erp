<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Revenue / Omzet dari Sales Order yang COMPLETED
        $totalRevenue = SalesOrder::where('status', 'COMPLETED')->sum('total_amount');

        // 2. Total Transaksi Sales Order
        $totalSalesOrders = SalesOrder::count();

        // 3. Total Jenis Produk
        $totalProducts = Product::count();

        // 4. Produk dengan stok menipis (misal stok <= 10)
        $lowStockProducts = Product::where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->get(['id', 'name', 'stock', 'sell_price']);

        // 5. 5 Transaksi Penjualan Terbaru (Diperbaiki dengan with('customer'))
        $recentSalesOrders = SalesOrder::with('customer')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue'     => $totalRevenue,
                'totalSalesOrders' => $totalSalesOrders,
                'totalProducts'    => $totalProducts,
                'lowStockCount'    => $lowStockProducts->count(),
            ],
            'lowStockProducts'  => $lowStockProducts,
            'recentSalesOrders' => $recentSalesOrders,
        ]);
    }
}
