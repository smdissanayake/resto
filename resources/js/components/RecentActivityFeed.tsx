import React from 'react';
import { CheckCircle2, UserPlus, AlertCircle, DollarSign } from 'lucide-react';
interface Activity {
  id: string;
  type: 'order' | 'table' | 'alert' | 'payment';
  text: string;
  time: string;
}
interface RecentActivityFeedProps {
  data: Activity[];
}
export function RecentActivityFeed({
  data
}: RecentActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return <CheckCircle2 size={14} className="text-green-500" />;
      case 'table':
        return <UserPlus size={14} className="text-blue-500" />;
      case 'alert':
        return <AlertCircle size={14} className="text-red-500" />;
      case 'payment':
        return <DollarSign size={14} className="text-[#FF6B00]" />;
    }
  };
  return <div className="bg-[#1E1E1E] border border-white/5 rounded-lg p-3 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 max-h-[200px]">
        {data.map(activity => <div key={activity.id} className="flex items-start gap-3 py-1">
            <div className="mt-0.5 flex-shrink-0 bg-white/5 p-1 rounded">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 truncate">{activity.text}</p>
              <p className="text-[10px] text-white/40">{activity.time}</p>
            </div>
          </div>)}
      </div>
    </div>;
}