import React, { useMemo, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { TableData, TableStatus } from '../components/TableStatusCard';
import { TableFilters, FilterType } from '../components/TableFilters';
import { FloorPlanView } from '../components/FloorPlanView';
import { TableStatusGrid } from '../components/TableStatusGrid';
// Mock Data Generator
const generateTables = (): TableData[] => {
  const tables: TableData[] = [];
  const statuses: TableStatus[] = ['free', 'occupied', 'waiting', 'unavailable'];
  const waiters = [{
    name: 'Sarah J.',
    initials: 'SJ'
  }, {
    name: 'Mike R.',
    initials: 'MR'
  }, {
    name: 'Alex L.',
    initials: 'AL'
  }, {
    name: 'Jordan P.',
    initials: 'JP'
  }, {
    name: 'Casey W.',
    initials: 'CW'
  }];
  // Create a grid-like layout for floor plan
  let idCounter = 1;
  for (let y = 1; y <= 5; y++) {
    for (let x = 1; x <= 5; x++) {
      if (Math.random() > 0.8) continue; // Skip some spots for layout variety
      const status = Math.random() > 0.5 ? 'occupied' : statuses[Math.floor(Math.random() * statuses.length)];
      const isOccupied = status === 'occupied';
      const waiter = isOccupied ? waiters[Math.floor(Math.random() * waiters.length)] : undefined;
      tables.push({
        id: `t-${idCounter}`,
        number: `${idCounter}`,
        status,
        waiter,
        timeSeated: isOccupied ? Math.floor(Math.random() * 90) + 5 : undefined,
        amount: isOccupied ? Math.floor(Math.random() * 150) + 20 + Math.random() : undefined,
        position: {
          x: x * 1.6,
          y: y * 0.9
        },
        seats: Math.random() > 0.7 ? 6 : Math.random() > 0.3 ? 4 : 2
      });
      idCounter++;
    }
  }
  return tables;
};
const MOCK_TABLES = generateTables();
export default function TableManagement() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Filter Logic
  const filteredTables = useMemo(() => {
    return MOCK_TABLES.filter(table => {
      // Status Filter
      if (filterStatus !== 'all' && table.status !== filterStatus) return false;
      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = table.number.includes(query);
        const matchesWaiter = table.waiter?.name.toLowerCase().includes(query);
        return matchesNumber || matchesWaiter;
      }
      return true;
    });
  }, [filterStatus, searchQuery]);
  // Stats Calculation
  const stats = useMemo(() => ({
    free: MOCK_TABLES.filter(t => t.status === 'free').length,
    occupied: MOCK_TABLES.filter(t => t.status === 'occupied').length,
    waiting: MOCK_TABLES.filter(t => t.status === 'waiting').length,
    total: MOCK_TABLES.length
  }), []);
  return <MainLayout>
      <div className="h-[calc(100vh-100px)] w-full flex flex-col overflow-hidden">
      {/* Header & Filters */}
      <TableFilters activeFilter={filterStatus} onFilterChange={setFilterStatus} searchQuery={searchQuery} onSearchChange={setSearchQuery} stats={stats} />

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col h-full overflow-hidden mt-4">
        {/* Top: Floor Plan (50%) */}
        <div className="h-1/2 w-full border border-white/5 rounded-xl overflow-hidden relative z-0 mb-4 bg-[#121212]">
          <FloorPlanView tables={filteredTables} selectedId={selectedTableId} onSelect={setSelectedTableId} />
        </div>

        {/* Bottom: Status Grid (50%) */}
        <div className="h-1/2 w-full relative z-10 bg-[#121212] overflow-y-auto">
          <TableStatusGrid tables={filteredTables} selectedId={selectedTableId} onSelect={setSelectedTableId} />
        </div>
      </div>
    </div>
    </MainLayout>;
}