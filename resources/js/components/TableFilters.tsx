import React from 'react';
import { Search } from 'lucide-react';
import { TableStatus } from './TableStatusCard';
export type FilterType = 'all' | TableStatus;
interface TableFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: {
    free: number;
    occupied: number;
    waiting: number;
    total: number;
  };
}
export function TableFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  stats
}: TableFiltersProps) {
  const filters: {
    id: FilterType;
    label: string;
    color?: string;
  }[] = [{
    id: 'all',
    label: 'All Tables'
  }, {
    id: 'free',
    label: 'Free',
    color: 'bg-green-500'
  }, {
    id: 'occupied',
    label: 'Occupied',
    color: 'bg-orange-500'
  }, {
    id: 'waiting',
    label: 'Waiting',
    color: 'bg-red-500'
  }];
  return <div className="w-full bg-[#1A1A1A] border-b border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-20 relative shadow-md">
      {/* Left: Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
        {filters.map(filter => <button key={filter.id} onClick={() => onFilterChange(filter.id)} className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2
              ${activeFilter === filter.id ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}
            `}>
            {filter.color && <span className={`w-2 h-2 rounded-full ${filter.color}`} />}
            {filter.label}
          </button>)}
      </div>

      {/* Center: Quick Stats */}
      <div className="hidden lg:flex items-center gap-4 text-sm text-white/40 font-medium">
        <span>{stats.free} Free</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{stats.occupied} Occupied</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>{stats.waiting} Waiting</span>
      </div>

      {/* Right: Search */}
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-white/40" />
        </div>
        <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Search table or waiter..." className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm transition-all" />
      </div>
    </div>;
}