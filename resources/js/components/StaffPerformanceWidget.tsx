import React from 'react';
interface StaffMember {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  performance: number; // 0-100
}
interface StaffPerformanceWidgetProps {
  data: StaffMember[];
}
export function StaffPerformanceWidget({
  data
}: StaffPerformanceWidgetProps) {
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-3">
        Staff Performance
      </h3>
      <div className="flex-1 space-y-3">
        {data.map(staff => <div key={staff.id} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/80 font-medium">{staff.name}</span>
              <span className="text-white/60">{staff.orders} orders</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF6B00] rounded-full" style={{
            width: `${staff.performance}%`
          }} />
            </div>
            <div className="text-[10px] text-white/40 text-right">
              ${staff.revenue.toLocaleString()} revenue
            </div>
          </div>)}
      </div>
    </div>;
}