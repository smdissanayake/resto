import React from 'react';
import { motion } from 'framer-motion';
import { TableData } from './TableStatusCard';
interface FloorPlanViewProps {
  tables: TableData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdatePosition?: (id: string, x: number, y: number) => void;
}

const STATUS_STYLES: any = {
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
  },
  reserved: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-100'
  }
};

export function FloorPlanView({
  tables,
  selectedId,
  onSelect,
  onUpdatePosition
}: FloorPlanViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleDragEnd = (id: string, info: any) => {
    if (!containerRef.current || !onUpdatePosition) return;

    // Calculate new position relative to container
    const container = containerRef.current.getBoundingClientRect();
    const xPercent = (info.point.x - container.left) / container.width * 10; // Convert to 0-10 scale
    const yPercent = (info.point.y - container.top) / container.height * 6;   // Convert to 0-6 scale

    // Clamp values
    const clampedX = Math.max(0, Math.min(10, xPercent));
    const clampedY = Math.max(0, Math.min(6, yPercent));

    onUpdatePosition(id, Math.round(clampedX), Math.round(clampedY));
  };

  return <div ref={containerRef} className="w-full h-full bg-[#1A1A1A] relative overflow-hidden">
    {/* Grid Pattern Background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
      backgroundSize: '10% 16.66%' // Approx for 10x6 grid
    }} />

    {/* Floor Plan Container */}
    <div className="absolute inset-0 p-8">
      {tables.map(table => {
        const styles = STATUS_STYLES[table.status] || STATUS_STYLES.free;
        const isSelected = selectedId === table.id;

        // Calculate position based on grid logic
        const left = `${(table.position.x / 10) * 100}%`;
        const top = `${(table.position.y / 6) * 100}%`;

        return <motion.button
          key={table.id}
          layoutId={`table-${table.id}`}
          onClick={() => onSelect(table.id)}
          drag={!!onUpdatePosition}
          dragMomentum={false}
          onDragEnd={(_, info) => handleDragEnd(table.id, info)}
          initial={false}
          animate={{
            scale: isSelected ? 1.1 : 1,
            zIndex: isSelected ? 50 : 1,
            boxShadow: isSelected ? '0 0 30px rgba(255, 107, 0, 0.3)' : 'none',
            left,
            top
          }}
          whileTap={{
            scale: 0.95,
            cursor: 'grabbing'
          }}
          whileDrag={{
            scale: 1.1,
            cursor: 'grabbing',
            zIndex: 100
          }}
          style={{
            width: table.seats > 4 ? '120px' : '80px',
            height: '80px',
            position: 'absolute',
            transform: 'translate(-50%, -50%)' // Center anchor
          }}
          className={`
                rounded-2xl flex flex-col items-center justify-center border-2 transition-colors duration-300 cursor-grab active:cursor-grabbing
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

    {/* Legend Overlay ... (omitted for brevity, keep if possible, but replace block replaces it) */}
    {/* Re-adding Legend manually to ensure it's not lost */}
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
        <div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500/50" />{' '}
        Reserved
      </div>
    </div>
  </div>;
}