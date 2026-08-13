<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\StockMovement;
use App\Models\SalesInvoice; // <-- Tambahan Baru
use App\Models\Expense;      // <-- Tambahan Baru
use Carbon\Carbon;           // <-- Tambahan Baru (Untuk ambil tahun saat ini)
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = SalesOrder::where('status', 'COMPLETED')->sum('total_amount');
        $totalSalesOrders = SalesOrder::count();
        $totalProducts = Product::count();

        $lowStockProducts = Product::where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->get(['id', 'name', 'stock', 'sell_price']);

        $recentSalesOrders = SalesOrder::with('customer')
            ->latest()
            ->take(5)
            ->get();

        $statusCounts = SalesOrder::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // ==========================================
        // TAMBAHAN BARU: Top 5 Produk Terlaris & Stock Movement
        // ==========================================

        // 1. Top 5 Produk Berdasarkan Jumlah Keluar (Sales / Stock Movement tipe OUT)
        // Menghitung dari relasi atau tabel item penjualan/stock movement
        $topProducts = DB::table('stock_movements')
            ->join('products', 'stock_movements.product_id', '=', 'products.id')
            ->where('stock_movements.type', 'OUT') // Barang keluar karena terjual/distribusi
            ->select('products.name', DB::raw('sum(stock_movements.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        // 2. Log Aktivitas Gudang Terbaru (Stock Movement)
        $recentStockMovements = StockMovement::with('product')
            ->latest()
            ->take(5)
            ->get();

        $currentYear = Carbon::now()->year;
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $chartRevenue = [];
        $chartExpense = [];

        for ($m = 1; $m <= 12; $m++) {
            $chartRevenue[] = SalesInvoice::whereYear('invoice_date', $currentYear)
                ->whereMonth('invoice_date', $m)
                ->sum('grand_total');

            $chartExpense[] = Expense::whereYear('expense_date', $currentYear)
                ->whereMonth('expense_date', $m)
                ->sum('amount');
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue'     => $totalRevenue,
                'totalSalesOrders' => $totalSalesOrders,
                'totalProducts'    => $totalProducts,
                'lowStockCount'    => $lowStockProducts->count(),
            ],
            'lowStockProducts'    => $lowStockProducts,
            'recentSalesOrders'   => $recentSalesOrders,
            'topProducts'         => $topProducts,          // <-- Kirim ke React
            'recentStockMovements' => $recentStockMovements,   // <-- Kirim ke React
            'chartData' => [
                'labels'  => $months,
                'revenue' => $chartRevenue,
                'expense' => $chartExpense,
            ],
            'chartStatusData' => [
                'labels' => array_keys($statusCounts),
                'data' => array_values($statusCounts),
            ]
        ]);
    }
}
