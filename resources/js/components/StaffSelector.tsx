import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
export type StaffMember = {
  id: string;
  name: string;
  initials: string;
  color: string; // fallback color if no image
};
interface StaffSelectorProps {
  staff: StaffMember[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function StaffSelector({
  staff,
  selectedId,
  onSelect
}: StaffSelectorProps) {
  return <div className="w-full flex justify-center items-center gap-6 py-8 overflow-x-auto no-scrollbar">
      {staff.map(member => {
      const isSelected = selectedId === member.id;
      return <button key={member.id} onClick={() => onSelect(member.id)} className="flex flex-col items-center gap-3 focus:outline-none group">
            <div className="relative">
              <motion.div animate={{
            borderColor: isSelected ? '#FF6B00' : 'rgba(255,255,255,0.1)',
            scale: isSelected ? 1.1 : 1
          }} transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25
          }} className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-[#1E1E1E] overflow-hidden relative z-10`}>
                {/* Avatar Placeholder / Initials */}
                <span className="text-xl font-bold text-white/80">
                  {member.initials}
                </span>
              </motion.div>

              {/* Glow effect for selected state */}
              {isSelected && <motion.div layoutId="selection-glow" className="absolute inset-0 rounded-full bg-[#FF6B00] blur-md opacity-40 -z-10" initial={{
            opacity: 0
          }} animate={{
            opacity: 0.4
          }} exit={{
            opacity: 0
          }} />}
            </div>

            <span className={`text-sm font-medium tracking-wide transition-colors duration-200 ${isSelected ? 'text-white' : 'text-white/50'}`}>
              {member.name}
            </span>
          </button>;
    })}
    </div>;
}