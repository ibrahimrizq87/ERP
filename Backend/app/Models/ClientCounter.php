<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientCounter extends Model
{
    use HasFactory;

    protected $table = 'client_counter';

    protected $fillable = [
        'shift_id',
        'account_id',
        'amount',
        'image',
    ];

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
