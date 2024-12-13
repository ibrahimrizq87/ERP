<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Model
{

    use HasFactory;

 protected $table = 'accounts';

 protected $fillable = [
     'account_name',
     'phone',
     'parent_id',
     'can_delete',
     'current_balance',
     'net_debit',
     'net_credit',
 ];


    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }
}
