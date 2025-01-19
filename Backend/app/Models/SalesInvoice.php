<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'tax_no',
        'tax_name',
        'client_name',
        'phone',
        'type',
        'date',
        'liters',
        'amount',
        'tax_amount',
        'tax_rate',
        'number',
        'account_id',
        'main_shift_id',
        'product_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function mainShift()
    {
        return $this->belongsTo(MainShift::class);
    }
}
