import React from 'react';
import { motion } from 'framer-motion';
interface CategoryFilterChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}
export function CategoryFilterChips({
  categories,
  activeCategory,
  onSelect
}: CategoryFilterChipsProps) {
  return <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {categories.map(category => {
      const isActive = activeCategory === category;
      return <motion.button key={category} whileTap={{
        scale: 0.95
      }} onClick={() => onSelect(category)} className={`
              px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${isActive ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}
            `}>
            {category}
          </motion.button>;
    })}
    </div>;
}