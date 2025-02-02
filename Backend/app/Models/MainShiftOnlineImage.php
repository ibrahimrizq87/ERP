<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainShiftOnlineImage extends Model
{
    use HasFactory;

    protected $table = 'main_shift_online_images';

    public $timestamps = false; 

    protected $fillable = ['image', 'main_shift_id'];

    public function mainShift()
    {
        return $this->belongsTo(MainShift::class, 'main_shift_id');
    }
}
