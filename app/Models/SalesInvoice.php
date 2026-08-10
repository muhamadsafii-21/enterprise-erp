<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    protected $guarded = ['id']; // Mengizinkan semua kolom diisi kecuali id

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function items()
    {
        return $this->hasMany(SalesInvoiceItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function payments()
    {
        return $this->hasMany(SalesPayment::class);
    }
}
