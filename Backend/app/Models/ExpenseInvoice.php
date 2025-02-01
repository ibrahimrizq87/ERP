<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'total_cash',
        'account_id',
        'expense_id',
        'payment_type',
        'note',
        'online_payment_image',
        'tax_amount',
        'tax_rate',
        'invoice_image',
    ];

    protected $casts = [
        'total_cash' => 'float',

        'tax_amount' => 'float',
      
    ];


    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function expense()
    {
        return $this->belongsTo(Account::class, 'expense_id');
    }
}
