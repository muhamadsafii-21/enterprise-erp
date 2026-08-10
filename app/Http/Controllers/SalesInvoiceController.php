<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\SalesPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesInvoiceController extends Controller
{
    // 1. Method Index (Halaman Daftar Invoice) - DITAMBAHKAN DI SINI
    public function index()
    {
        $salesInvoices = SalesInvoice::with(['customer', 'salesOrder', 'payments'])
            ->latest()
            ->paginate(10);

        return Inertia::render('SalesInvoices/Index', [
            'salesInvoices' => $salesInvoices,
        ]);
    }

    // 2. Method Create (Wajib Berdasarkan Sales Order)
    public function create($salesOrderId = null)
    {
        // Jika diakses tanpa ID Sales Order, tolak dan kembalikan ke halaman Sales Orders
        if (!$salesOrderId) {
            return redirect()->route('sales-orders.index')
                ->with('error', 'Faktur Penjualan harus dibuat melalui Sales Order yang tersedia.');
        }

        // Ambil data Sales Order beserta customer dan produknya
        $salesOrder = SalesOrder::with(['customer', 'items.product'])->findOrFail($salesOrderId);

        // Generate nomor invoice otomatis rapi berformat INV-SLS/YYYYMM/00X
        $latestInvoice = SalesInvoice::latest()->first();
        $nextNumber = $latestInvoice ? $latestInvoice->id + 1 : 1;
        $invoiceNumber = 'INV-SLS/' . date('Ym') . '/' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return Inertia::render('SalesInvoices/Create', [
            'invoiceNumber' => $invoiceNumber,
            'salesOrder' => $salesOrder,
        ]);
    }
    // 3. Menyimpan data invoice baru
    public function store(Request $request)
    {
        $request->validate([
            'sales_order_id' => 'required|exists:sales_orders,id',
            'invoice_number' => 'required|string|unique:sales_invoices,invoice_number',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
        ]);

        $salesOrder = SalesOrder::with(['items', 'customer'])->findOrFail($request->sales_order_id);

        $invoice = SalesInvoice::create([
            'invoice_number' => $request->invoice_number,
            'sales_order_id' => $salesOrder->id,
            'customer_id' => $salesOrder->customer_id,
            'customer_name' => $salesOrder->customer->name ?? 'General Customer',
            'invoice_date' => $request->invoice_date,
            'due_date' => $request->due_date,
            'grand_total' => $salesOrder->total_amount,
            'paid_amount' => 0,
            'status' => 'unpaid',
            'notes' => $request->notes,
        ]);

        foreach ($salesOrder->items as $item) {
            SalesInvoiceItem::create([
                'sales_invoice_id' => $invoice->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'sub_total' => $item->sub_total ?? ($item->quantity * $item->unit_price),
            ]);
        }

        return redirect()->route('sales-invoices.index')->with('success', 'Faktur Penjualan berhasil diterbitkan!');
    }

    // 4. Method Show (Detail Invoice)
    public function show(SalesInvoice $salesInvoice)
    {
        $salesInvoice->load('items.product', 'salesOrder.customer', 'payments');

        return Inertia::render('SalesInvoices/Show', [
            'salesInvoice' => $salesInvoice
        ]);
    }

    // 5. Method Simpan Pembayaran
    public function storePayment(Request $request, SalesInvoice $salesInvoice)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
        ]);

        // Generate nomor pembayaran unik
        $paymentNumber = 'PAY-' . date('Ymd') . '-' . rand(1000, 9999);

        // Simpan data pembayaran
        SalesPayment::create([
            'payment_number' => $paymentNumber,
            'sales_invoice_id' => $salesInvoice->id,
            'payment_date' => $request->payment_date,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
        ]);

        // Hitung total akumulasi pembayaran
        $totalPaid = $salesInvoice->payments()->sum('amount');

        // Tentukan status baru
        $status = 'unpaid';
        if ($totalPaid >= $salesInvoice->grand_total) {
            $status = 'paid';
        } elseif ($totalPaid > 0) {
            $status = 'partial';
        }

        // Update data pada invoice
        $salesInvoice->update([
            'paid_amount' => $totalPaid,
            'status' => $status,
        ]);

        // Jika status invoice sudah PAID (Lunas), update Sales Order jadi COMPLETED
        if ($status === 'paid') {
            $salesInvoice->salesOrder()->update([
                'status' => 'COMPLETED'
            ]);
        }

        return redirect()->back()->with('success', 'Pembayaran berhasil dicatat dan Sales Order kini COMPLETED!');
    }
}
