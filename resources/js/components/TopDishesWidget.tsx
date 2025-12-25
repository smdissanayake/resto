import React from 'react';
interface TopDish {
  id: string;
  name: string;
  count: number;
  revenue: number;
}
interface TopDishesWidgetProps {
  data: TopDish[];
}
export function TopDishesWidget({
  data
}: TopDishesWidgetProps) {
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-3">Top Dishes</h3>
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        {data.map((dish, index) => <div key={dish.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-bold text-[#FF6B00] w-4">
                {index + 1}
              </span>
              <span className="text-xs text-white/80 truncate">
                {dish.name}
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-bold text-white">
                {dish.count} sold
              </div>
              <div className="text-[10px] text-white/40">${dish.revenue}</div>
            </div>
          </div>)}
      </div>
    </div>;
}