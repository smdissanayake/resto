import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, User } from 'lucide-react';
export type TableStatus = 'free' | 'occupied' | 'waiting' | 'unavailable';
export interface TableData {
  id: string;
  number: string;
  status: TableStatus;
  waiter?: {
    name: string;
    initials: string;
  };
  timeSeated?: number; // minutes
  amount?: number;
  position: {
    x: number;
    y: number;
  };
  seats: number;
}
interface TableStatusCardProps {
  table: TableData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}
const STATUS_CONFIG = {
  free: {
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    label: 'Free',
    border: 'border-green-500/30'
  },
  occupied: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    label: 'Occupied',
    border: 'border-orange-500/30'
  },
  waiting: {
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    label: 'Waiting',
    border: 'border-red-500/30'
  },
  unavailable: {
    color: 'text-gray-400',
    bg: 'bg-gray-500/20',
    label: 'Closed',
    border: 'border-gray-500/30'
  }
};
export function TableStatusCard({
  table,
  isSelected,
  onSelect
}: TableStatusCardProps) {
  const config = STATUS_CONFIG[table.status];
  return <motion.button whileTap={{
    scale: 0.98
  }} onClick={() => onSelect(table.id)} className={`
        w-full text-left p-4 rounded-xl bg-[#1E1E1E] border-2 transition-all duration-200
        ${isSelected ? 'border-[#FF6B00] shadow-lg shadow-[#FF6B00]/20 scale-[1.02]' : 'border-transparent hover:border-white/10'}
      `}>
      {/* Header: Number + Status */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl font-bold text-white">T-{table.number}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Waiter Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-medium">
          {table.waiter ? table.waiter.initials : <User size={18} />}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-white/90 font-medium">
            {table.waiter ? table.waiter.name : 'No Waiter'}
          </span>
          <span className="text-xs text-white/40">{table.seats} Seats</span>
        </div>
      </div>

      {/* Footer: Time + Amount */}
      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock size={14} />
          <span className="text-sm font-medium">
            {table.timeSeated ? `${table.timeSeated}m` : '-'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/90 font-bold">
          {table.amount ? <>
              <span className="text-xs text-white/40">$</span>
              <span>{table.amount.toFixed(2)}</span>
            </> : <span className="text-white/20">-</span>}
        </div>
      </div>
    </motion.button>;
}