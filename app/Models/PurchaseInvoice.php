<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function goodsReceipt()
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseInvoiceItem::class, 'purchase_invoice_id');
    }

    public function payments()
    {
        return $this->hasMany(PurchasePayment::class, 'purchase_invoice_id');
    }

    public function updatePaymentStatus()
    {
        // Hitung total pembayaran khusus untuk invoice INI saja
        $totalPaid = $this->payments()->sum('amount');

        $status = 'unpaid';
        if ($totalPaid >= $this->grand_total && $this->grand_total > 0) {
            $status = 'paid';
        } elseif ($totalPaid > 0) {
            $status = 'partially_paid';
        }

        $this->update([
            'paid_amount' => $totalPaid,
            'status' => $status,
        ]);
    }
}
