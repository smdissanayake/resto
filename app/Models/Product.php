<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'cost_price',
        'stock_quantity',
        'image',
        'type',
        'is_available',
        'description',
        'modifiers'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'is_available' => 'boolean',
        'modifiers' => 'array',
        'stock_quantity' => 'integer'
    ];

    public function ingredients()
    {
        return $this->belongsToMany(InventoryItem::class, 'product_ingredients')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
