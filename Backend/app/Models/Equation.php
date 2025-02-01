<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equation extends Model
{
    use HasFactory;

    protected $fillable = [
        'collection_id',
        'base_id',
        'first_price',
        'current_price',
        'number_of_periods',
    ];

    protected $casts = [
        'current_price' => 'float',
        'first_price' => 'float',

      
    ];

    public function collection()
    {
        return $this->belongsTo(Account::class, 'collection_id');
    }

    public function base()
    {
        return $this->belongsTo(Account::class, 'base_id');
    }
}
