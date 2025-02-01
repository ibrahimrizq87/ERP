<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentDocument extends Model
{
    use HasFactory;

    protected $table = 'payment_documents';  // Table name (optional as it's inferred from model name)

    // Fields that are mass assignable
    protected $fillable = [
        'amount',
        'type',
        'user_id',
        'receiver_name',
        'company_account_id',
        'customer_account_id',
        'image',
        'statement'
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function companyAccount()
    {
        return $this->belongsTo(Account::class, 'company_account_id');
    }

    public function customerAccount()
    {
        return $this->belongsTo(Account::class, 'customer_account_id');
    }
}
