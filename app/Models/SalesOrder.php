<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    protected $guarded = ['id'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function items()
    {
        return $this->hasMany(SalesOrderItem::class);
    }
    public function salesInvoice()
    {
        return $this->hasOne(SalesInvoice::class, 'sales_order_id');
    }
}
