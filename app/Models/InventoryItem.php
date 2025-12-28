<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'inventory_category_id',
        'name',
        'stock_level',
        'unit',
        'usage_unit',
        'conversion_factor',
        'price_per_unit',
        'reorder_threshold'
    ];

    public function category()
    {
        return $this->belongsTo(InventoryCategory::class, 'inventory_category_id');
    }
}
