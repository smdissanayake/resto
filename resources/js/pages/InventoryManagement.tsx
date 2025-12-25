import React, { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Plus, Search } from 'lucide-react';
import { CategoryFilterChips } from '../components/CategoryFilterChips';
import { InventoryCard, InventoryItem } from '../components/InventoryCard';
// Mock Data
const INVENTORY_ITEMS: InventoryItem[] = [{
  id: '1',
  name: 'Tomatoes (Roma)',
  category: 'Produce',
  stockLevel: 85,
  unit: 'kg',
  quantity: 42.5,
  price: 2.4
}, {
  id: '2',
  name: 'Angus Beef Patties',
  category: 'Meat',
  stockLevel: 15,
  unit: 'box',
  quantity: 3,
  price: 45.0
}, {
  id: '3',
  name: 'Cheddar Cheese',
  category: 'Dairy',
  stockLevel: 45,
  unit: 'kg',
  quantity: 12,
  price: 8.5
}, {
  id: '4',
  name: 'Burger Buns',
  category: 'Dry Goods',
  stockLevel: 90,
  unit: 'pack',
  quantity: 150,
  price: 3.2
}, {
  id: '5',
  name: 'Iceberg Lettuce',
  category: 'Produce',
  stockLevel: 30,
  unit: 'head',
  quantity: 24,
  price: 1.5
}, {
  id: '6',
  name: 'Coca Cola Syrup',
  category: 'Beverages',
  stockLevel: 10,
  unit: 'tank',
  quantity: 1,
  price: 85.0
}, {
  id: '7',
  name: 'French Fries',
  category: 'Dry Goods',
  stockLevel: 65,
  unit: 'kg',
  quantity: 200,
  price: 1.8
}, {
  id: '8',
  name: 'Bacon Strips',
  category: 'Meat',
  stockLevel: 55,
  unit: 'kg',
  quantity: 15,
  price: 12.0
}, {
  id: '9',
  name: 'Whole Milk',
  category: 'Dairy',
  stockLevel: 25,
  unit: 'gal',
  quantity: 8,
  price: 4.2
}, {
  id: '10',
  name: 'Red Onions',
  category: 'Produce',
  stockLevel: 70,
  unit: 'kg',
  quantity: 18,
  price: 1.9
}];
const CATEGORIES = ['All', 'Produce', 'Meat', 'Dairy', 'Beverages', 'Dry Goods'];
export default function InventoryManagement() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredItems = INVENTORY_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  // Sort by stock level (low stock first)
  const sortedItems = [...filteredItems].sort((a, b) => a.stockLevel - b.stockLevel);
  return <MainLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Top Bar */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl px-6 py-4 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white">
            Inventory Management
          </h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors w-64" />
            </div>
            <button className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#FF6B00]/20">
              <Plus size={18} />
              Add Item
            </button>
          </div>
        </div>

        <CategoryFilterChips categories={CATEGORIES} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map(item => <InventoryCard key={item.id} item={item} onEdit={id => console.log('Edit', id)} onReorder={id => console.log('Reorder', id)} />)}
        </div>

        {sortedItems.length === 0 && <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <p className="text-lg">No items found</p>
            <button onClick={() => {
          setActiveCategory('All');
          setSearchQuery('');
        }} className="mt-2 text-[#FF6B00] hover:underline">
              Clear filters
            </button>
          </div>}
      </div>
    </div>
    </MainLayout>;
}