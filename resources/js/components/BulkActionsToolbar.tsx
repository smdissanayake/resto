import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Download, Trash2, X } from 'lucide-react';
interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onClockOutAll: () => void;
  onExport: () => void;
  onDelete: () => void;
}
export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onClockOutAll,
  onExport,
  onDelete
}: BulkActionsToolbarProps) {
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="bg-[#FF6B00] rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg shadow-[#FF6B00]/20">
      <div className="flex items-center gap-4">
        <span className="bg-white/20 px-3 py-1 rounded-lg text-white font-bold text-sm">
          {selectedCount}
        </span>
        <span className="text-white font-medium">Staff members selected</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onClockOutAll} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
          <Clock size={16} />
          Clock Out All
        </button>

        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
          <Download size={16} />
          Export
        </button>

        <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-100 rounded-lg text-white text-sm font-medium transition-colors">
          <Trash2 size={16} />
          Delete
        </button>

        <div className="w-px h-8 bg-white/20 mx-2" />

        <button onClick={onClearSelection} className="p-2 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
    </motion.div>;
}