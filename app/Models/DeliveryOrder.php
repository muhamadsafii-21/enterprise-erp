<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'do_number',
        'sales_order_id',
        'delivery_date',
        'status',
        'shipping_address',
        'driver_name',
        'vehicle_number',
        'notes',
    ];

    // Relasi ke Sales Order
    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    // Relasi ke Item Surat Jalan
    public function items()
    {
        return $this->hasMany(DeliveryOrderItem::class);
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
