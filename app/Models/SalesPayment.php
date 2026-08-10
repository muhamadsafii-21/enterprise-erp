<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_number',
        'sales_invoice_id',
        'payment_date',
        'amount',
        'payment_method',
        'notes',
    ];

    public function salesInvoice()
    {
        return $this->belongsTo(SalesInvoice::class);
    }
}
