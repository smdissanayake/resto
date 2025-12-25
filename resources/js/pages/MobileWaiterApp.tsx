import React, { useState } from 'react';
import { MobileSearchBar } from '../components/MobileSearchBar';
import { MobileMenuItem } from '../components/MobileMenuItem';
import { StickyOrderBar } from '../components/StickyOrderBar';
import { MenuItemType } from '../components/MenuItem';
// Reusing mock data structure
const MENU_ITEMS: MenuItemType[] = [
// Burgers
{
  id: 'b1',
  name: 'Classic Smash Burger',
  price: 12.99,
  category: 'Burgers',
  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
}, {
  id: 'b2',
  name: 'Double Bacon Deluxe',
  price: 15.99,
  category: 'Burgers',
  image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop'
}, {
  id: 'b3',
  name: 'Mushroom Swiss',
  price: 14.49,
  category: 'Burgers',
  image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop'
}, {
  id: 'b4',
  name: 'Spicy Jalapeño',
  price: 13.99,
  category: 'Burgers',
  image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=400&h=400&fit=crop'
},
// Pizza
{
  id: 'p1',
  name: 'Margherita Classic',
  price: 14.99,
  category: 'Pizza',
  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop'
}, {
  id: 'p2',
  name: 'Pepperoni Feast',
  price: 16.99,
  category: 'Pizza',
  image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
},
// Drinks
{
  id: 'd1',
  name: 'Craft Cola',
  price: 2.99,
  category: 'Drinks',
  image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop'
}, {
  id: 'd2',
  name: 'Fresh Lemonade',
  price: 3.49,
  category: 'Drinks',
  image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop'
}, {
  id: 'd3',
  name: 'Iced Coffee',
  price: 3.99,
  category: 'Drinks',
  image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop'
}];
export function MobileWaiterApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{
    item: MenuItemType;
    quantity: number;
  }[]>([]);
  const filteredItems = MENU_ITEMS.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleAddToCart = (item: MenuItemType) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? {
          ...i,
          quantity: i.quantity + 1
        } : i);
      }
      return [...prev, {
        item,
        quantity: 1
      }];
    });
  };
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  return <div className="min-h-screen bg-[#121212] text-white font-sans pb-32">
      <div className="max-w-md mx-auto min-h-screen bg-[#121212] relative shadow-2xl">
        {/* Status Bar Area Placeholder */}
        <div className="h-safe-top w-full bg-[#121212]" />

        {/* Search Header */}
        <MobileSearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Menu List */}
        <div className="divide-y divide-white/5">
          {filteredItems.length > 0 ? filteredItems.map(item => <MobileMenuItem key={item.id} item={item} onAdd={handleAddToCart} />) : <div className="p-8 text-center text-gray-500">
              <p>No items found</p>
            </div>}
        </div>

        {/* Sticky Order Bar */}
        <StickyOrderBar itemCount={totalItems} totalAmount={totalAmount} onViewOrder={() => console.log('View Order')} />
      </div>
    </div>;
}