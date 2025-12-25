import React, { useState } from 'react';
import { CategorySidebar } from '../components/CategorySidebar';
import { MenuItemGrid } from '../components/MenuItemGrid';
import { CartPanel, CartItem } from '../components/CartPanel';
import { MenuItemType } from '../components/MenuItem';
import { CheckoutPage } from './CheckoutPage';
// Mock Data
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
}, {
  id: 'b5',
  name: 'Veggie Supreme',
  price: 11.99,
  category: 'Burgers',
  image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop'
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
}, {
  id: 'p3',
  name: 'BBQ Chicken',
  price: 17.99,
  category: 'Pizza',
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'
},
// Salads
{
  id: 's1',
  name: 'Caesar Salad',
  price: 10.99,
  category: 'Salads',
  image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop'
}, {
  id: 's2',
  name: 'Greek Salad',
  price: 11.99,
  category: 'Salads',
  image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop'
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
},
// Desserts
{
  id: 'de1',
  name: 'Chocolate Lava Cake',
  price: 7.99,
  category: 'Desserts',
  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=400&h=400&fit=crop'
}, {
  id: 'de2',
  name: 'Vanilla Bean Ice Cream',
  price: 5.99,
  category: 'Desserts',
  image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400&h=400&fit=crop'
}];
export default function POSInterface() {
  const [activeCategory, setActiveCategory] = useState('Burgers');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);
  const handleAddToCart = (item: MenuItemType) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {
          ...i,
          quantity: i.quantity + 1
        } : i);
      }
      return [...prev, {
        ...item,
        quantity: 1
      }];
    });
  };
  const handleUpdateQuantity = (id: string, change: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? {
            ...item,
            quantity: newQuantity
          } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };
  const handlePay = () => {
    if (cartItems.length > 0) {
      setIsCheckout(true);
    }
  };
  const handleCheckoutComplete = () => {
    alert('Payment processed successfully!');
    setCartItems([]);
    setIsCheckout(false);
  };
  if (isCheckout) {
    return <CheckoutPage cartItems={cartItems} onBack={() => setIsCheckout(false)} onComplete={handleCheckoutComplete} />;
  }
  return <div className="h-screen w-full bg-[#121212] flex overflow-hidden select-none">
      {/* Left Column: Categories (15%) */}
      <div className="w-[15%] h-full flex-shrink-0 z-20">
        <CategorySidebar activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      {/* Center Column: Menu Grid (60%) */}
      <div className="w-[60%] h-full flex flex-col bg-[#121212] relative z-10">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-3xl font-bold text-white">{activeCategory}</h1>
          <p className="text-white/40 text-sm mt-1">
            {filteredItems.length} items available
          </p>
        </div>
        <MenuItemGrid items={filteredItems} onAdd={handleAddToCart} />
      </div>

      {/* Right Column: Cart (25%) */}
      <div className="w-[25%] h-full flex-shrink-0 z-30 shadow-2xl shadow-black/50">
        <CartPanel cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onPay={handlePay} />
      </div>
    </div>;
}