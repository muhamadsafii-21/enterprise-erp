<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderBy('created_at', 'desc')->get();
        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers
        ]);
    }

    public function create()
    {
        // Generate otomatis kode berikutnya untuk ditampilkan preview-nya di form
        $latestSupplier = Supplier::latest()->first();
        $nextId = $latestSupplier ? $latestSupplier->id + 1 : 1;
        $autoCode = 'SUP-' . str_pad($nextId, 3, '0', STR_PAD_LEFT); // Hasil: SUP-001, SUP-002, dst.

        return Inertia::render('Suppliers/Create', [
            'autoCode' => $autoCode
        ]);
    }

    public function store(Request $request)
    {
        // Hitung ulang otomatis di backend untuk mencegah duplikasi saat bersamaan
        $latestSupplier = Supplier::latest()->first();
        $nextId = $latestSupplier ? $latestSupplier->id + 1 : 1;
        $autoCode = 'SUP-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        // Masukkan otomatis kode ke dalam array data yang akan disimpan
        $validated['code'] = $autoCode;

        Supplier::create($validated);

        return redirect()->route('suppliers.index')->with('success', 'Supplier berhasil ditambahkan!');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        // Kode tidak perlu divalidasi unique lagi karena sifatnya otomatis dan tidak diubah saat edit
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return redirect()->route('suppliers.index')->with('success', 'Supplier berhasil diperbarui!');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->route('suppliers.index')->with('success', 'Supplier berhasil dihapus!');
    }
}
