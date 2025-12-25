import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, RefreshCw } from 'lucide-react';
import { StockProgressIndicator } from './StockProgressIndicator';
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number; // percentage 0-100
  unit: string;
  quantity: number;
  price: number;
}
interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (id: string) => void;
  onReorder: (id: string) => void;
}
const CATEGORY_COLORS: Record<string, string> = {
  Produce: 'bg-green-500/20 text-green-400',
  Meat: 'bg-red-500/20 text-red-400',
  Dairy: 'bg-blue-500/20 text-blue-400',
  Beverages: 'bg-purple-500/20 text-purple-400',
  'Dry Goods': 'bg-yellow-500/20 text-yellow-400'
};
export function InventoryCard({
  item,
  onEdit,
  onReorder
}: InventoryCardProps) {
  const isLowStock = item.stockLevel <= 20;
  const categoryColor = CATEGORY_COLORS[item.category] || 'bg-gray-500/20 text-gray-400';
  return <motion.div layout initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} whileHover={{
    y: -4
  }} className={`
        bg-[#1E1E1E] rounded-xl p-6 shadow-lg relative overflow-hidden group
        ${isLowStock ? 'border-l-4 border-red-500' : 'border border-white/5'}
      `}>
      {isLowStock && <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold mb-2 ${categoryColor}`}>
            {item.category}
          </span>
          <h3 className="text-white font-bold text-lg leading-tight">
            {item.name}
          </h3>
        </div>

        <div className="flex-shrink-0 ml-4">
          <StockProgressIndicator percentage={item.stockLevel} size={60} />
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">
            Current Stock
          </p>
          <p className="text-white font-mono text-xl">
            {item.quantity}{' '}
            <span className="text-sm text-white/40">{item.unit}</span>
          </p>
          <p className="text-[#FF6B00] font-bold text-sm mt-1">
            ${item.price.toFixed(2)}{' '}
            <span className="text-white/40 font-normal">/ unit</span>
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 relative z-10">
        <button onClick={() => onEdit(item.id)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Edit2 size={14} />
          Edit
        </button>
        <button onClick={() => onReorder(item.id)} className={`
            flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${isLowStock ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-[#FF6B00] text-white hover:bg-[#e66000]'}
          `}>
          <RefreshCw size={14} />
          Reorder
        </button>
      </div>
    </motion.div>;
}