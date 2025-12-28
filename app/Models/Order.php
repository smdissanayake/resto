<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'total_amount',
        'status',
        'payment_status',
        'payment_method',
        'dining_table_id',
        'discount',
        'discount_type',
        'user_id'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function diningTable()
    {
        return $this->belongsTo(DiningTable::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
