import React from 'react';
import { Edit2, Check } from 'lucide-react';
export interface StaffMember {
  id: string;
  name: string;
  role: 'Server' | 'Chef' | 'Host' | 'Bartender' | 'Manager';
  clockIn: string;
  clockOut: string | null;
  status: 'On Duty' | 'Off Duty';
  avatar?: string;
}
interface StaffTableRowProps {
  staff: StaffMember;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}
export function StaffTableRow({
  staff,
  isSelected,
  onToggle,
  onEdit
}: StaffTableRowProps) {
  return <tr className={`
        border-b border-white/5 transition-colors duration-200
        ${isSelected ? 'bg-[#FF6B00]/10' : 'hover:bg-white/5'}
      `}>
      <td className="px-6 py-4 w-[40px]">
        <button onClick={() => onToggle(staff.id)} className={`
            w-5 h-5 rounded border flex items-center justify-center transition-colors
            ${isSelected ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'bg-transparent border-white/20 text-transparent hover:border-white/40'}
          `}>
          <Check size={14} strokeWidth={3} />
        </button>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80">
            {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-white font-medium">{staff.name}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-white/60 text-sm">{staff.role}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-white/80 text-sm font-mono">{staff.clockIn}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-white/80 text-sm font-mono">
          {staff.clockOut || '--:--'}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${staff.status === 'On Duty' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/40 border-white/10'}
          `}>
          {staff.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <button onClick={() => onEdit(staff.id)} className="p-2 text-white/40 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-colors">
          <Edit2 size={16} />
        </button>
      </td>
    </tr>;
}