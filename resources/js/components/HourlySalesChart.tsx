import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
interface HourlySalesChartProps {
  data: {
    hour: string;
    sales: number;
  }[];
}
export function HourlySalesChart({
  data
}: HourlySalesChartProps) {
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-3">Sales by Hour</h3>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{
          top: 5,
          right: 5,
          left: -20,
          bottom: 0
        }}>
            <XAxis dataKey="hour" stroke="rgba(255,255,255,0.2)" tick={{
            fill: 'rgba(255,255,255,0.4)',
            fontSize: 10
          }} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{
            fill: 'rgba(255,255,255,0.4)',
            fontSize: 10
          }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px'
          }} itemStyle={{
            color: '#fff',
            fontSize: '12px'
          }} cursor={{
            fill: 'rgba(255,255,255,0.05)'
          }} />
            <Bar dataKey="sales" fill="#FF6B00" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>;
}