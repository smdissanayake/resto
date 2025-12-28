<?php

namespace Database\Seeders;

use App\Models\InventoryCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Produce',    // එළවළු සහ පලතුරු
            'Meat',       // මස් වර්ග
            'Dairy',      // කිරි නිෂ්පාදන (චීස්, බටර්)
            'Beverages',  // බීම වර්ග
            'Dry Goods',  // වියළි ආහාර (හාල්, පිටි, සීනි)
            'Spices',     // තුනපහ
            'Packaging'   // අසුරන දේවල් (පෙට්ටි, බෑග්)
        ];

        foreach ($categories as $category) {
            InventoryCategory::firstOrCreate([
                'name' => $category,
                'slug' => Str::slug($category)
            ]);
        }
    }
}
