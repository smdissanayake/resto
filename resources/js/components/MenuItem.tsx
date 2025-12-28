import React, { lazy } from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
export interface MenuItemType {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  modifiers?: any[];
}
interface MenuItemProps {
  item: MenuItemType;
  onAdd: (item: MenuItemType) => void;
}
export function MenuItem({
  item,
  onAdd
}: MenuItemProps) {
  const { settings } = usePage().props as any;
  const currencySymbol = (settings as Record<string, string>)?.currency_symbol || '$';

  return <motion.button whileTap={{
    scale: 0.95
  }} onClick={() => onAdd(item)} className="bg-[#1E1E1E] rounded-xl p-4 flex flex-col items-start text-left w-full h-full shadow-lg border border-white/5 active:border-[#FF6B00]/50 transition-colors group relative overflow-hidden">
    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[#2A2A2A]">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-active:scale-110" loading="lazy" />
    </div>

    <div className="flex-1 w-full flex flex-col justify-between">
      <h3 className="text-white font-semibold text-lg leading-tight mb-1 line-clamp-2">
        {item.name}
      </h3>
      <div className="flex items-center justify-between w-full mt-2">
        <span className="text-[#FF6B00] font-bold text-xl">
          {currencySymbol}{item.price.toFixed(2)}
        </span>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-active:bg-[#FF6B00] transition-colors">
          <Plus size={18} />
        </div>
      </div>
    </div>
  </motion.button>;
}