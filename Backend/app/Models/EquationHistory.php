<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquationHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'equation_id',
        'last_price',
        'current_price',
        'amount',
        'year',
        'period_number',
    ];


    protected $casts = [
        'amount' => 'float',

      
    ];

    public function equation()
    {
        return $this->belongsTo(Equation::class);
    }
}
