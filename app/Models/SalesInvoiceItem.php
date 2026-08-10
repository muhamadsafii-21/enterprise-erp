<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    protected $guarded = ['id'];

    // Relasi kembali ke Sales Invoice
    public function salesInvoice()
    {
        return $this->belongsTo(SalesInvoice::class);
    }

    // Relasi ke Produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
