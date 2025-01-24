<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnlinePayment extends Model
{
    use HasFactory;

    protected $table = 'online_payments';

    protected $fillable = [
        'shift_id',
        'amount',
        'client_name',
        'image',
    ];

    protected $casts = [
        'amount' => 'float',
    ];


    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
}
