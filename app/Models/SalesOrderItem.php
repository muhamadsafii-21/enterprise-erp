<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    // Relasi balik ke SalesOrder
    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    // Relasi ke Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
