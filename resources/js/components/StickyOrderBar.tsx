import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface StickyOrderBarProps {
  itemCount: number;
  totalAmount: number;
  onViewOrder: () => void;
}
export function StickyOrderBar({
  itemCount,
  totalAmount,
  onViewOrder
}: StickyOrderBarProps) {
  return <AnimatePresence>
      {itemCount > 0 && <motion.div initial={{
      y: 100
    }} animate={{
      y: 0
    }} exit={{
      y: 100
    }} transition={{
      type: 'spring',
      damping: 20,
      stiffness: 300
    }} className="fixed bottom-0 left-0 right-0 z-30 p-4 pb-8 bg-[#1A1A1A]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-md mx-auto">
            <motion.button whileTap={{
          scale: 0.98
        }} onClick={onViewOrder} className="w-full bg-[#FF6B00] text-white font-semibold text-lg py-4 rounded-2xl shadow-lg shadow-[#FF6B00]/20 flex items-center justify-between px-6">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold">
                {itemCount}
              </span>
              <span>View Order</span>
              <span>${totalAmount.toFixed(2)}</span>
            </motion.button>
          </div>
        </motion.div>}
    </AnimatePresence>;
}