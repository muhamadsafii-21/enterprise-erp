<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseInvoice;
use App\Models\SalesInvoice;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Expense;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class ReportController extends Controller
{
    // 1. Laporan Kartu Stok (Stock Movements)
    public function stockCard(Request $request)
    {
        $products = Product::select('id', 'name', 'sku', 'stock')->get();
        $query = StockMovement::with('product');

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $movements = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Reports/StockCard', [
            'movements' => $movements,
            'products' => $products,
            'filters' => $request->only(['product_id', 'start_date', 'end_date']),
        ]);
    }

    // 2. Laporan Utang Usaha (Accounts Payable)
    public function accountsPayable()
    {
        $invoices = PurchaseInvoice::with('supplier')
            ->where('status', '!=', 'paid')
            ->get()
            ->map(function ($invoice) {
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

        $totalDebt = $invoices->sum('remaining_balance');

        return Inertia::render('Reports/AccountsPayable', [
            'invoices' => $invoices,
            'totalDebt' => $totalDebt,
        ]);
    }

    public function profitAndLoss(Request $request)
    {
        // Gunakan filled() atau pengecekan eksplisit agar jika user memilih tanggal, itu yang dipakai.
        // Jika tidak ada parameter dikirim, baru gunakan default awal/akhir bulan ini.
        $startDate = $request->filled('start_date')
            ? $request->input('start_date')
            : now()->startOfMonth()->toDateString();

        $endDate = $request->filled('end_date')
            ? $request->input('end_date')
            : now()->endOfMonth()->toDateString();

        $totalRevenue = SalesInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');
        $totalHpp = PurchaseInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');
        $grossProfit = $totalRevenue - $totalHpp;
        $totalExpenses = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');
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
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }



    public function exportPdf(Request $request)
    {
        // Menggunakan logika filter tanggal yang sama persis
        $startDate = $request->filled('start_date')
            ? $request->input('start_date')
            : now()->startOfMonth()->toDateString();

        $endDate = $request->filled('end_date')
            ? $request->input('end_date')
            : now()->endOfMonth()->toDateString();

        // Perhitungan data keuangan dari database
        $totalRevenue = SalesInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');
        $totalCogs = PurchaseInvoice::whereBetween('invoice_date', [$startDate, $endDate])->sum('grand_total');
        $grossProfit = $totalRevenue - $totalCogs;
        $totalExpense = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');
        $netProfit = $grossProfit - $totalExpense;

        // Masukkan ke dalam array data untuk dikirim ke view PDF
        $data = [
            'startDate'    => $startDate,
            'endDate'      => $endDate,
            'totalRevenue' => $totalRevenue,
            'totalCogs'    => $totalCogs,
            'grossProfit'  => $grossProfit,
            'totalExpense' => $totalExpense,
            'netProfit'    => $netProfit,
        ];

        // Load view PDF
        $pdf = Pdf::loadView('exports.profit-loss-pdf', $data);

        return $pdf->download('laporan-laba-rugi-' . $startDate . '_s_d_' . $endDate . '.pdf');
    }
}
