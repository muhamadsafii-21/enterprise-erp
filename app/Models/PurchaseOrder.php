<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'order_date',
        'status',
        'paid_amount',
        'payment_status',
    ];

    /**
     * Relasi ke model Supplier (Setiap PO milik 1 Supplier)
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Relasi ke model PurchaseOrderItem (Setiap PO punya banyak item produk)
     */
    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }
    // Di dalam class PurchaseOrder tambahkan method ini:

}
