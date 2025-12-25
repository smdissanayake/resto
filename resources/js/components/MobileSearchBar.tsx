import React from 'react';
import { Search } from 'lucide-react';
interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
export function MobileSearchBar({
  value,
  onChange
}: MobileSearchBarProps) {
  return <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md px-4 py-2 border-b border-white/5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 bg-[#1E1E1E] border-none rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FF6B00]/50 focus:bg-[#252525] transition-all text-base" placeholder="Search menu..." />
      </div>
    </div>;
}