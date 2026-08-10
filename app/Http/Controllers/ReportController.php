<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseInvoice;
use App\Models\SalesInvoice;
use App\Models\SalesOrder;
use App\Models\SalesInvoiceItem;
use Inertia\Inertia;

class ReportController extends Controller
{


    // Menampilkan form untuk membuat Sales Invoice berdasarkan Sales Order
    public function create($salesOrderId)
    {
        $salesOrder = SalesOrder::with('items.product')->findOrFail($salesOrderId);

        return Inertia::render('SalesInvoices/Create', [
            'salesOrder' => $salesOrder,
        ]);
    }

    // Menyimpan data Sales Invoice ke database
    public function store(Request $request)
    {
        $request->validate([
            'sales_order_id' => 'required|exists:sales_orders,id',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'grand_total' => 'required|numeric',
        ]);

        // Buat nomor invoice otomatis (contoh: INV-SLS/YYYYMM/00X)
        $invoiceNumber = 'INV-SLS/' . date('Ym') . '/' . str_pad(SalesInvoice::count() + 1, 3, '0', STR_PAD_LEFT);

        $salesOrder = SalesOrder::with('items')->findOrFail($request->sales_order_id);

        // 1. Simpan Header Invoice
        $invoice = SalesInvoice::create([
            'invoice_number' => $invoiceNumber,
            'sales_order_id' => $salesOrder->id,
            'customer_name' => $salesOrder->customer_name,
            'invoice_date' => $request->invoice_date,
            'due_date' => $request->due_date,
            'grand_total' => $salesOrder->total_amount,
            'paid_amount' => 0,
            'status' => 'unpaid',
        ]);

        // 2. Simpan Item Invoice (disalin dari Sales Order Items)
        foreach ($salesOrder->items as $item) {
            SalesInvoiceItem::create([
                'sales_invoice_id' => $invoice->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'sub_total' => $item->sub_total,
            ]);
        }

        return redirect()->route('sales-invoices.index')->with('success', 'Faktur Penjualan berhasil dibuat!');
    }
    public function accountsPayable()
    {
        // Ambil semua invoice pembelian yang belum lunas (status bukan 'paid')
        $invoices = PurchaseInvoice::with('supplier')
            ->where('status', '!=', 'paid')
            ->get()
            ->map(function ($invoice) {
                // Hitung sisa kurang bayar
                $remaining = $invoice->grand_total - $invoice->paid_amount;
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'supplier_name' => $invoice->supplier->name ?? '-',
                    'invoice_date' => $invoice->invoice_date,
                    'due_date' => $invoice->due_date,
                    'grand_total' => $invoice->grand_total,
                    'paid_amount' => $invoice->paid_amount,
                    'remaining_balance' => $remaining,
                    'status' => $invoice->status,
                ];
            });

        // Hitung total keseluruhan utang yang belum dibayar
        $totalDebt = $invoices->sum('remaining_balance');

        return Inertia::render('Reports/AccountsPayable', [
            'invoices' => $invoices,
            'totalDebt' => $totalDebt,
        ]);
    }
    // Sesuaikan dengan model penjualanmu jika ada
    // use App\Models\Expense; // Jika ada tabel beban operasional



    public function profitAndLoss(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // 1. Total Pendapatan ditarik dari Sales Invoice
        $totalRevenue = SalesInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');

        // 2. Harga Pokok Penjualan (HPP) ditarik dari Purchase Invoice
        $totalHpp = PurchaseInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');

        // 3. Laba Kotor
        $grossProfit = $totalRevenue - $totalHpp;

        // 4. Beban Operasional (sementara 0)
        $totalExpenses = 0;

        // 5. Laba Bersih
        $netProfit = $grossProfit - $totalExpenses;

        return Inertia::render('Reports/ProfitAndLoss', [
            'summary' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_revenue' => $totalRevenue,
                'total_hpp' => $totalHpp,
                'gross_profit' => $grossProfit,
                'total_expenses' => $totalExpenses,
                'net_profit' => $netProfit,
            ]
        ]);
    }
}
