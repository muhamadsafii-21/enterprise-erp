<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes; // <-- Aktifkan trait di sini

    protected $fillable = [
        'name',
        'code',
        'buy_price',
        'sell_price',
        'stock',
        'min_stock',
    ];

    /**
     * Relasi ke StockMovements (jika ada)
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
