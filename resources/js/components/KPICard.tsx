import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  data?: {
    value: number;
  }[];
}

export function KPICard({
  title,
  value,
  change,
  trend,
  data = []
}: KPICardProps) {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';

  const trendColor = isNeutral ? 'text-gray-400' : (isPositive ? 'text-green-500' : 'text-red-500');
  const Icon = isNeutral ? null : (isPositive ? ArrowUpRight : ArrowDownRight);

  return (
    <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 flex flex-col h-full">
      <h3 className="text-xs text-white/60 uppercase font-medium mb-1">
        {title}
      </h3>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <div className={`flex items-center text-xs font-medium ${trendColor}`}>
          {Icon && <Icon size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="h-[40px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.length > 0 ? data : [{ value: 0 }, { value: 0 }]}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isNeutral ? '#9ca3af' : (isPositive ? '#22c55e' : '#ef4444')}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}