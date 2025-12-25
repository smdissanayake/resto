import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}
export function NumericKeypad({
  onKeyPress,
  onDelete
}: NumericKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return <div className="grid grid-cols-3 gap-6 max-w-[320px] mx-auto">
      {keys.map((key, index) => {
      if (key === '') return <div key={`empty-${index}`} />; // Empty slot
      const isDelete = key === 'del';
      return <motion.button key={key} whileTap={{
        scale: 0.9
      }} onClick={() => isDelete ? onDelete() : onKeyPress(key)} className={`
              w-[90px] h-[90px] rounded-full flex items-center justify-center
              text-3xl font-bold text-white transition-colors
              focus:outline-none select-none touch-manipulation
              ${isDelete ? 'bg-transparent text-white/40 hover:text-white' : 'bg-white/5 border border-white/10 active:bg-[#FF6B00] active:border-[#FF6B00] active:shadow-[0_0_30px_rgba(255,107,0,0.4)]'}
            `}>
            {isDelete ? <Delete className="w-8 h-8" /> : key}
          </motion.button>;
    })}
    </div>;
}