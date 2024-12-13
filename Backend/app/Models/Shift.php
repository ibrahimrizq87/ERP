<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $table = 'shifts';


    protected $fillable = [
        'user_id',
        'opening_image',
        'opening_amount',
        'ending_image',
        'ending_amount',
        'shift',
        'status',
        'amount',
        'total_money',
        'total_cash',
        'total_payed_online',
        'total_client_deposit',
        'machine_id',
        'date',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function onlinePayments()
    {
        return $this->hasMany(OnlinePayment::class, 'shift_id');
    }


    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }

    public function clientCounters()
    {
        return $this->hasMany(ClientCounter::class, 'shift_id');
    }
}
