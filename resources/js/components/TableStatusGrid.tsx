import React from 'react';
import { TableData, TableStatusCard } from './TableStatusCard';
interface TableStatusGridProps {
  tables: TableData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
export function TableStatusGrid({
  tables,
  selectedId,
  onSelect
}: TableStatusGridProps) {
  return <div className="w-full h-full bg-[#121212] overflow-y-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
        {tables.map(table => <TableStatusCard key={table.id} table={table} isSelected={selectedId === table.id} onSelect={onSelect} />)}

        {tables.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20">
            <p className="text-lg font-medium">No tables found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>}
      </div>
    </div>;
}