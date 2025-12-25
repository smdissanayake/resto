import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ChefHat, AlertCircle } from 'lucide-react';
export type OrderStatus = 'New' | 'Cooking' | 'Ready';
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers?: string[];
}
export interface OrderType {
  id: string;
  tableNo: string;
  items: OrderItem[];
  status: OrderStatus;
  startTime: Date; // When order was placed
  serverName: string;
}
interface OrderTicketProps {
  order: OrderType;
  onStatusChange: (id: string) => void;
}
export function OrderTicket({
  order,
  onStatusChange
}: OrderTicketProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  // Update timer every minute
  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date().getTime() - order.startTime.getTime();
      setElapsedMinutes(Math.floor(diff / 60000));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [order.startTime]);
  const isLate = elapsedMinutes >= 20;
  const getStatusColor = () => {
    switch (order.status) {
      case 'New':
        return 'bg-blue-500';
      case 'Cooking':
        return 'bg-orange-500';
      case 'Ready':
        return 'bg-green-500';
    }
  };
  const getStatusIcon = () => {
    switch (order.status) {
      case 'New':
        return <AlertCircle size={20} />;
      case 'Cooking':
        return <ChefHat size={20} />;
      case 'Ready':
        return <CheckCircle2 size={20} />;
    }
  };
  return <motion.div layout initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1,
    borderColor: isLate && order.status !== 'Ready' ? '#EF4444' : 'transparent'
  }} exit={{
    opacity: 0,
    scale: 0.9
  }} whileTap={{
    scale: 0.98
  }} onClick={() => onStatusChange(order.id)} className={`
        relative w-full bg-[#1E1E1E] rounded-xl overflow-hidden cursor-pointer group
        border-4 transition-colors duration-300 shadow-xl
        ${isLate && order.status !== 'Ready' ? 'shadow-red-500/20 animate-pulse-slow' : 'border-transparent'}
      `}>
      {/* Header */}
      <div className={`
        px-4 py-3 flex justify-between items-center
        ${isLate && order.status !== 'Ready' ? 'bg-red-500 text-white' : 'bg-[#EAB308] text-black'}
      `}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black">T-{order.tableNo}</span>
          <span className="text-sm font-medium opacity-80">
            #{order.id.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-xl">
          <Clock size={20} />
          <span>{elapsedMinutes}m</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Items List */}
        <div className="space-y-4">
          {order.items.map((item, idx) => <div key={idx} className="flex items-start gap-3">
              <div className="min-w-[32px] h-8 bg-white/10 rounded flex items-center justify-center text-lg font-bold text-[#EAB308]">
                {item.quantity}
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-white leading-tight">
                  {item.name}
                </p>
                {item.modifiers && item.modifiers.length > 0 && <div className="mt-1 flex flex-wrap gap-1">
                    {item.modifiers.map((mod, i) => <span key={i} className="text-sm text-red-400 font-medium italic">
                        + {mod}
                      </span>)}
                  </div>}
              </div>
            </div>)}
        </div>

        {/* Footer Info */}
        <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center text-white/40 text-sm">
          <span>Server: {order.serverName}</span>
          <div className={`
            flex items-center gap-2 px-3 py-1 rounded-full text-white font-bold text-sm
            ${getStatusColor()}
          `}>
            {getStatusIcon()}
            <span className="uppercase tracking-wide">{order.status}</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay Hint */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
        <span className="bg-black/80 text-white px-4 py-2 rounded-full font-bold backdrop-blur-md">
          Tap to Advance
        </span>
      </div>
    </motion.div>;
}