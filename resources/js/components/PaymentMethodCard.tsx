import React from 'react';
import { motion } from 'framer-motion';
import { BoxIcon } from 'lucide-react';
interface PaymentMethodCardProps {
  id: string;
  label: string;
  icon: BoxIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
}
export function PaymentMethodCard({
  id,
  label,
  icon: Icon,
  isSelected,
  onSelect
}: PaymentMethodCardProps) {
  return <motion.button whileTap={{
    scale: 0.95
  }} animate={{
    scale: isSelected ? 1.05 : 1,
    borderColor: isSelected ? '#FF6B00' : 'rgba(255,255,255,0.1)',
    backgroundColor: isSelected ? 'rgba(255,107,0,0.1)' : '#1E1E1E'
  }} onClick={() => onSelect(id)} className="w-[200px] h-[200px] rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-colors duration-300 relative overflow-hidden group">
      <div className={`p-4 rounded-full transition-colors duration-300 ${isSelected ? 'bg-[#FF6B00] text-white' : 'bg-white/5 text-white/60 group-hover:text-white'}`}>
        <Icon size={48} strokeWidth={1.5} />
      </div>

      <span className={`text-xl font-bold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
        {label}
      </span>

      {/* Glow effect */}
      {isSelected && <motion.div layoutId="payment-glow" className="absolute inset-0 bg-[#FF6B00] opacity-5 blur-xl pointer-events-none" />}
    </motion.button>;
}