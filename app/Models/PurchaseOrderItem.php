<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'purchase_order_id',
        'product_id',
        'quantity',
        'unit_cost',
        'subtotal',
    ];

    /**
     * Relasi ke model PurchaseOrder (Setiap item dimiliki oleh 1 PO)
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Relasi ke model Product (Setiap item mereferensikan 1 Produk)
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
