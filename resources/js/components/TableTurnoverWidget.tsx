import React from 'react';
interface TableMetrics {
  avgTurnover: string;
  tablesServed: number;
  occupancy: number;
}
interface TableTurnoverWidgetProps {
  data: TableMetrics;
}
export function TableTurnoverWidget({
  data
}: TableTurnoverWidgetProps) {
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-3">Table Metrics</h3>
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-white/60 uppercase mb-1">
            Avg Turnover
          </div>
          <div className="text-lg font-bold text-white">{data.avgTurnover}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-white/60 uppercase mb-1">
            Tables Served
          </div>
          <div className="text-lg font-bold text-white">
            {data.tablesServed}
          </div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-white/60 uppercase mb-1">
            Current Occupancy
          </div>
          <div className="text-lg font-bold text-white">{data.occupancy}%</div>
          <div className="h-1 w-full bg-white/10 rounded-full mt-2">
            <div className={`h-full rounded-full ${data.occupancy > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{
            width: `${data.occupancy}%`
          }} />
          </div>
        </div>
      </div>
    </div>;
}