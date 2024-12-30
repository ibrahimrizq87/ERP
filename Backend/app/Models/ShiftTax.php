<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiftTax extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'shift_id',
        'tax_amount',
        'tax_rate',
    ];

   

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
}
