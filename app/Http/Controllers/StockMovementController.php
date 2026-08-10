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
        $query = StockMovement::with('product')->latest();

        // Filter berdasarkan Produk (opsional)
        if ($request->has('product_id') && $request->product_id != '') {
            $query->where('product_id', $request->product_id);
        }

        // Filter berdasarkan Tipe Mutasi (IN / OUT)
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        $stockMovements = $query->paginate(15)->withQueryString();
        $products = Product::select('id', 'name')->get();

        return Inertia::render('StockMovements/Index', [
            'stockMovements' => $stockMovements,
            'products'       => $products,
            'filters' => $request->only(['product_id', 'type']),
        ]);
    }
}
