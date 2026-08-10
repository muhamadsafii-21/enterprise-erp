<?php

namespace App\Http\Controllers;

use App\Models\GoodsReceipt;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceItem;
use App\Models\PurchasePayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PurchaseInvoiceController extends Controller
{
    public function index()
    {
        $invoices = PurchaseInvoice::with('supplier')->latest()->get();
        return Inertia::render('PurchaseInvoices/Index', [
            'invoices' => $invoices
        ]);
    }

    public function create()
    {
        $goodsReceipts = GoodsReceipt::with([
            'supplier',
            'purchaseOrder.items.product'
        ])
            ->where('status', 'received')
            ->get();

        return Inertia::render('PurchaseInvoices/Create', [
            'goodsReceipts' => $goodsReceipts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'goods_receipt_id' => 'required|exists:goods_receipts,id',
            'supplier_id'      => 'required|exists:suppliers,id',
            'invoice_date'     => 'required|date',
            'due_date'         => 'required|date',
            'subtotal'         => 'required|numeric',
            'discount'         => 'nullable|numeric',
            'tax'              => 'nullable|numeric',
            'grand_total'      => 'required|numeric',
            'items'            => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
        ]);

        DB::transaction(function () use ($validated) {
            $invoiceNumber = 'INV-' . date('Ym') . '-' . str_pad(PurchaseInvoice::count() + 1, 4, '0', STR_PAD_LEFT);

            $invoice = PurchaseInvoice::create([
                'invoice_number'   => $invoiceNumber,
                'goods_receipt_id' => $validated['goods_receipt_id'],
                'supplier_id'      => $validated['supplier_id'],
                'invoice_date'     => $validated['invoice_date'],
                'due_date'         => $validated['due_date'],
                'subtotal'         => $validated['subtotal'],
                'discount'         => $validated['discount'] ?? 0,
                'tax'              => $validated['tax'] ?? 0,
                'grand_total'      => $validated['grand_total'],
                'paid_amount'      => 0,
                'status'           => 'unpaid'
            ]);

            foreach ($validated['items'] as $item) {
                PurchaseInvoiceItem::create([
                    'purchase_invoice_id' => $invoice->id,
                    'item_name'           => $item['item_name'],
                    'quantity'            => $item['quantity'],
                    'unit_price'          => $item['unit_price'],
                    'total_price'         => $item['quantity'] * $item['unit_price'],
                ]);
            }

            GoodsReceipt::where('id', $validated['goods_receipt_id'])->update(['status' => 'invoiced']);
        });

        return redirect()->route('purchase-invoices.index')->with('success', 'Purchase Invoice berhasil dibuat!');
    }

    public function show($id)
    {
        $invoice = PurchaseInvoice::with(['supplier', 'goodsReceipt', 'items', 'payments'])
            ->findOrFail($id);

        return Inertia::render('PurchaseInvoices/Show', [
            'invoice' => $invoice
        ]);
    }

    // Method untuk menyimpan pembayaran cicilan / lunas di Invoice
    public function storePayment(Request $request, $id)
    {
        $request->validate([
            'amount'         => 'required|numeric|min:1',
            'payment_date'   => 'required|date',
            'payment_method' => 'required|string',
            'notes'          => 'nullable|string',
        ]);

        $invoice = PurchaseInvoice::findOrFail($id);

        PurchasePayment::create([
            'purchase_invoice_id' => $invoice->id,
            'amount'              => $request->amount,
            'payment_date'        => $request->payment_date,
            'payment_method'      => $request->payment_method,
            'notes'               => $request->notes,
        ]);

        $invoice->updatePaymentStatus();

        return redirect()->back()->with('success', 'Pembayaran faktur berhasil dicatatkan!');
    }

    public function markAsPaid($id)
    {
        $invoice = PurchaseInvoice::findOrFail($id);
        $invoice->update([
            'paid_amount' => $invoice->grand_total,
            'status' => 'paid'
        ]);

        return redirect()->back()->with('success', 'Status tagihan berhasil diperbarui menjadi LUNAS (PAID)!');
    }
}
