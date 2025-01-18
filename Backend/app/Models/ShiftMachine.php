<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiftMachine extends Model
{
    use HasFactory;

    protected $table = 'shift_machines';

    protected $fillable = [
        'open_amount',
        'close_amount',
        'close_image',
        'total_liters_amount',
        'total_money',
        'main_shift_id',
        'product_id',
        'machine_id',
    ];

    public function shift()
    {
        return $this->belongsTo(MainShift::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }
}
