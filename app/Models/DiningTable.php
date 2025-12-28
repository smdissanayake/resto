<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiningTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'seats',
        'status',
        'position_x',
        'position_y',
        'current_order_id',
        'waiter_name',
        'reservation_name',
        'reservation_time'
    ];

    protected $casts = [
        'position_x' => 'integer',
        'position_y' => 'integer',
        'seats' => 'integer',
    ];

    public function currentOrder()
    {
        return $this->belongsTo(Order::class, 'current_order_id');
    }
}
