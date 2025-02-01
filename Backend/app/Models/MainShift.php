<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainShift extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'worker_id',
        'supervisor_id',
        'status',
        'shift',
        'date',
    ];

 


    /**
     * Relationships.
     */
    public function worker()
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }


    public function shiftMachines()
    {
        return $this->hasMany(ShiftMachine::class);
    }
 


}
