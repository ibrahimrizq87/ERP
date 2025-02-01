<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{

    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'amount',
        'start_amount',
    ];


    protected $casts = [
        'price' => 'float',
    ];

    public function machines()
    {
        return $this->hasMany(Machine::class, 'product_id');
    }
}
