<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'product_id',
        'price',
        'amount_letters',
        'total_cash',
        'account_id',
        'supplier_id',
        'payment_type',
        'note',
        'online_payment_image',
        'tax_amount',
        'tax_rate',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Account::class, 'supplier_id');
    }
}
