<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'code'       => 'nullable|string|unique:products,code',
            'buy_price'  => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'stock'      => 'required|integer|min:0',
            'min_stock'  => 'required|integer|min:0',
        ]);

        $code = $request->code;

        // Auto-generate Kode Produk jika kosong
        // Jika Kode Produk kosong, buat otomatis
        if (empty($code)) {
            $prefix = 'PRD-' . date('Ym') . '-';

            // Tambahkan ->withTrashed() agar produk yang di-soft-delete tetap terbaca nomor urutnya
            $lastProduct = Product::withTrashed()
                ->where('code', 'LIKE', $prefix . '%')
                ->orderBy('id', 'desc')
                ->first();

            if ($lastProduct) {
                $lastNumber = (int) substr($lastProduct->code, -3);
                $nextNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
            } else {
                $nextNumber = '001';
            }

            $code = $prefix . $nextNumber;
        }

        Product::create([
            'name'       => $request->name,
            'code'       => $code,
            'buy_price'  => $request->buy_price,
            'sell_price' => $request->sell_price,
            'stock'      => $request->stock,
            'min_stock'  => $request->min_stock,
        ]);

        return redirect()->route('products.index')->with('message', 'Produk berhasil ditambahkan!');
    }


    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'code'       => 'nullable|string|unique:products,code,' . $product->id,
            'buy_price'  => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'stock'      => 'required|integer|min:0',
            'min_stock'  => 'required|integer|min:0',
        ]);

        $product->update($request->all());

        return redirect()->route('products.index')->with('message', 'Produk berhasil diperbarui!');
    }
    public function destroy(Product $product)
    {
        $product->delete(); // Ini otomatis jadi Soft Delete karena model sudah pakai trait SoftDeletes
        return redirect()->route('products.index')->with('message', 'Produk berhasil diarsipkan/dihapus!');
    }
}
