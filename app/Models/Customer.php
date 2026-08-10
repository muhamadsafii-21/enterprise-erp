<?php

namespace App\Models;

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
    ];

    /**
     * Relasi ke Sales Invoices (jika nanti pelanggan ini memiliki banyak faktur)
     */
    public function salesInvoices()
    {
        return $this->hasMany(SalesInvoice::class);
    }
}
