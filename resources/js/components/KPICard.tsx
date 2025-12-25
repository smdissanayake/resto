import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  data: {
    value: number;
  }[];
}
export function KPICard({
  title,
  value,
  change,
  trend,
  data
}: KPICardProps) {
  const isPositive = trend === 'up';
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 flex flex-col h-full">
      <h3 className="text-xs text-white/60 uppercase font-medium mb-1">
        {title}
      </h3>
      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="h-[40px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>;
}