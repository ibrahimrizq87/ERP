<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductMove extends Model
{
    use HasFactory;
    protected $table = 'product_moves';
    protected $fillable = [
        'type',
        'liters',
        'total_price',
        'date',
        'product_id',
        'main_shift_id',
    ];

    protected $casts = [
        'total_price' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function mainShift()
    {
        return $this->belongsTo(MainShift::class);
    }
}
