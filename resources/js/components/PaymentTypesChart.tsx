import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
interface PaymentTypesChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}
export function PaymentTypesChart({
  data
}: PaymentTypesChartProps) {
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-2">Payment Methods</h3>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
            </Pie>
            <Tooltip contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px'
          }} itemStyle={{
            color: '#fff',
            fontSize: '12px'
          }} />
            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.6)'
          }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>;
}