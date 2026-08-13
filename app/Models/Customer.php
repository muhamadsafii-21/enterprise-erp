<?php

namespace App\Models;

use App\Models\SalesInvoice;
use App\Models\SalesOrder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'internal_notes',
    ];

    /**
     * Relasi ke Sales Invoices (jika nanti pelanggan ini memiliki banyak faktur)
     */
    public function salesInvoices()
    {
        return $this->hasMany(SalesInvoice::class);
    }
    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class, 'customer_id');
    }
}
