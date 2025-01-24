<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Machine extends Model
{
    protected $table = 'machines';
    use HasFactory;


    protected $fillable = [
        'product_id',
        'machine_number',
        'start_amount'

        
     
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
