<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $guarded = [];

    // Tambahan relasi: 1 Supplier bisa memiliki banyak Purchase Order
    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
