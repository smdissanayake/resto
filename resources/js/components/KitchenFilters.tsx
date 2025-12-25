import React from 'react';
import { motion } from 'framer-motion';
export type KitchenFilterType = 'All' | 'New' | 'Cooking' | 'Ready';
interface KitchenFiltersProps {
  activeFilter: KitchenFilterType;
  counts: Record<KitchenFilterType, number>;
  onSelect: (filter: KitchenFilterType) => void;
}
export function KitchenFilters({
  activeFilter,
  counts,
  onSelect
}: KitchenFiltersProps) {
  const filters: KitchenFilterType[] = ['All', 'New', 'Cooking', 'Ready'];
  const getColor = (filter: KitchenFilterType) => {
    switch (filter) {
      case 'New':
        return 'bg-blue-500';
      case 'Cooking':
        return 'bg-orange-500';
      case 'Ready':
        return 'bg-green-500';
      default:
        return 'bg-gray-600';
    }
  };
  return <div className="flex gap-4 items-center overflow-x-auto no-scrollbar py-2">
      {filters.map(filter => {
      const isActive = activeFilter === filter;
      const colorClass = getColor(filter);
      return <motion.button key={filter} whileTap={{
        scale: 0.95
      }} onClick={() => onSelect(filter)} className={`
              relative px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300
              ${isActive ? 'bg-white text-black font-bold shadow-lg' : 'bg-[#1E1E1E] text-white/60 hover:bg-[#2A2A2A]'}
            `}>
            <span className="text-lg">{filter}</span>
            <span className={`
              px-2.5 py-0.5 rounded-full text-xs font-bold text-white
              ${isActive ? 'bg-black/20 text-black' : colorClass}
            `}>
              {counts[filter]}
            </span>
          </motion.button>;
    })}
    </div>;
}