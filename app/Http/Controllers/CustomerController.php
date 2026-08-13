<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::latest()->paginate(10);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        Customer::create($request->all());

        return redirect()->route('customers.index')
            ->with('message', 'Pelanggan berhasil ditambahkan.');
    }

    public function show(Customer $customer)
    {
        // 1. Ambil data Sales Orders beserta relasi fakturnya
        $salesOrders = $customer->salesOrders()->with('salesInvoice')->latest()->paginate(10)->through(function ($order) {
            // Ambil data dari faktur jika ada
            $invoice = $order->salesInvoice;
            $grandTotal = $invoice ? $invoice->grand_total : $order->total_amount;
            $paidAmount = $invoice ? $invoice->paid_amount : 0;
            $remaining = $grandTotal - $paidAmount;

            return [
                'id' => $order->id,
                'created_at' => $order->created_at,
                'total_amount' => $grandTotal,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remaining,
                'invoice_status' => $invoice ? $invoice->status : 'no invoice',
                'status' => $order->status,
            ];
        });

        $invoices = $customer->salesInvoices;
        $totalTransaksi = $invoices->sum('grand_total');
        $sisaPiutang = $invoices->where('status', '!=', 'paid')->sum(function ($invoice) {
            return $invoice->grand_total - $invoice->paid_amount;
        });

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
            'salesOrders' => $salesOrders,
            'stats' => [
                'total_transaksi' => $totalTransaksi,
                'sisa_piutang' => $sisaPiutang,
                'status_loyalitas' => $totalTransaksi > 10000000 ? 'VIP Member' : 'Reguler',
            ]
        ]);
    }
    // -------------------------------------

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $customer->update($request->all());

        return redirect()->route('customers.index')
            ->with('message', 'Data pelanggan berhasil diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('message', 'Pelanggan berhasil dihapus.');
    }
    public function updateNotes(Request $request, Customer $customer)
    {
        $request->validate([
            'internal_notes' => 'nullable|string',
        ]);

        $customer->update([
            'internal_notes' => $request->internal_notes,
        ]);

        return redirect()->back()->with('message', 'Catatan internal berhasil diperbarui.');
    }
}
