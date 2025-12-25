import React from 'react';
import { motion } from 'framer-motion';
import { TableData } from './TableStatusCard';
interface FloorPlanViewProps {
  tables: TableData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
const STATUS_STYLES = {
  free: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-100'
  },
  occupied: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-100'
  },
  waiting: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-100'
  },
  unavailable: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/50',
    text: 'text-gray-300'
  }
};
export function FloorPlanView({
  tables,
  selectedId,
  onSelect
}: FloorPlanViewProps) {
  return <div className="w-full h-full bg-[#1A1A1A] relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }} />

      {/* Floor Plan Container - Using absolute positioning for demo layout */}
      <div className="absolute inset-0 p-8">
        {tables.map(table => {
        const styles = STATUS_STYLES[table.status];
        const isSelected = selectedId === table.id;
        // Calculate position based on grid logic (mock positioning)
        // In a real app, x/y would be precise coordinates
        const left = `${table.position.x / 10 * 100}%`;
        const top = `${table.position.y / 6 * 100}%`;
        return <motion.button key={table.id} layoutId={`table-${table.id}`} onClick={() => onSelect(table.id)} initial={false} animate={{
          scale: isSelected ? 1.1 : 1,
          zIndex: isSelected ? 50 : 1,
          boxShadow: isSelected ? '0 0 30px rgba(255, 107, 0, 0.3)' : 'none'
        }} whileTap={{
          scale: 0.95
        }} style={{
          left,
          top,
          width: table.seats > 4 ? '120px' : '80px',
          height: '80px',
          position: 'absolute',
          transform: 'translate(-50%, -50%)' // Center anchor
        }} className={`
                rounded-2xl flex flex-col items-center justify-center border-2 transition-colors duration-300
                ${styles.bg} 
                ${isSelected ? 'border-[#FF6B00] border-[3px]' : styles.border}
              `}>
              <span className={`text-lg font-bold ${styles.text}`}>
                {table.number}
              </span>
              {table.seats > 2 && <div className="flex gap-1 mt-1">
                  {Array.from({
              length: Math.min(table.seats, 4)
            }).map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${styles.border.replace('border-', 'bg-')}`} />)}
                  {table.seats > 4 && <span className="text-[8px] text-white/50">+</span>}
                </div>}
            </motion.button>;
      })}
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/5 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/50" />{' '}
          Free
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-full bg-orange-500/50 border border-orange-500/50" />{' '}
          Occupied
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/50" />{' '}
          Waiting
        </div>
      </div>
    </div>;
}