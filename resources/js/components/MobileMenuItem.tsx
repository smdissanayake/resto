import React, { lazy } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MenuItemType } from './MenuItem';
interface MobileMenuItemProps {
  item: MenuItemType;
  onAdd: (item: MenuItemType) => void;
}
export function MobileMenuItem({
  item,
  onAdd
}: MobileMenuItemProps) {
  return <div className="flex items-center gap-4 p-4 bg-[#1E1E1E] border-b border-white/5 last:border-0 active:bg-[#252525] transition-colors">
      {/* Thumbnail */}
      <div className="h-[60px] w-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-[#2A2A2A]">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-white truncate leading-tight">
          {item.name}
        </h3>
        <p className="text-sm font-semibold text-[#FF6B00] mt-1">
          ${item.price.toFixed(2)}
        </p>
      </div>

      {/* Add Button */}
      <motion.button whileTap={{
      scale: 0.9
    }} onClick={() => onAdd(item)} className="h-11 w-11 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-[#FF6B00] transition-colors flex-shrink-0" aria-label={`Add ${item.name} to order`}>
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>
    </div>;
}