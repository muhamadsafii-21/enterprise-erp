<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Menampilkan daftar riwayat mutasi stok (IN/OUT)
     */
    public function index(Request $request)
    {
        $query = StockMovement::with(['product']);

        // Filter berdasarkan tipe (IN / OUT)
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter berdasarkan produk
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Batasi 10 data per halaman menggunakan paginate(10)
        $stockMovements = $query->latest()->paginate(10)->withQueryString();

        $products = Product::all();

        return Inertia::render('StockMovements/Index', [
            'stockMovements' => $stockMovements,
            'products' => $products,
            'filters' => $request->only(['type', 'product_id']),
        ]);
    }
}
