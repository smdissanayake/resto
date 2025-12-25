import React, { useEffect, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { AnimatePresence } from 'framer-motion';
import { KitchenFilters, KitchenFilterType } from '../components/KitchenFilters';
import { OrderTicket, OrderType, OrderStatus } from '../components/OrderTicket';
// Mock Data Generator
const generateMockOrders = (): OrderType[] => {
  const now = new Date();
  return [{
    id: 'ord-1234',
    tableNo: '12',
    status: 'Cooking',
    startTime: new Date(now.getTime() - 1000 * 60 * 22),
    serverName: 'Sarah J.',
    items: [{
      id: '1',
      name: 'Double Bacon Deluxe',
      quantity: 2,
      modifiers: ['No Onions', 'Extra Cheese']
    }, {
      id: '2',
      name: 'Truffle Fries',
      quantity: 1
    }]
  }, {
    id: 'ord-1235',
    tableNo: '05',
    status: 'New',
    startTime: new Date(now.getTime() - 1000 * 60 * 2),
    serverName: 'Mike R.',
    items: [{
      id: '3',
      name: 'Margherita Pizza',
      quantity: 1
    }, {
      id: '4',
      name: 'Caesar Salad',
      quantity: 1,
      modifiers: ['Add Chicken']
    }, {
      id: '5',
      name: 'Coke Zero',
      quantity: 2
    }]
  }, {
    id: 'ord-1236',
    tableNo: '08',
    status: 'Cooking',
    startTime: new Date(now.getTime() - 1000 * 60 * 12),
    serverName: 'Alex P.',
    items: [{
      id: '6',
      name: 'Spicy Jalapeño Burger',
      quantity: 1,
      modifiers: ['Medium Rare']
    }]
  }, {
    id: 'ord-1237',
    tableNo: '21',
    status: 'Ready',
    startTime: new Date(now.getTime() - 1000 * 60 * 15),
    serverName: 'Sarah J.',
    items: [{
      id: '7',
      name: 'Chocolate Lava Cake',
      quantity: 2
    }, {
      id: '8',
      name: 'Vanilla Ice Cream',
      quantity: 2
    }]
  }, {
    id: 'ord-1238',
    tableNo: '15',
    status: 'New',
    startTime: new Date(now.getTime() - 1000 * 60 * 1),
    serverName: 'Jordan K.',
    items: [{
      id: '9',
      name: 'BBQ Chicken Pizza',
      quantity: 1
    }, {
      id: '10',
      name: 'Garlic Bread',
      quantity: 1
    }]
  }, {
    id: 'ord-1239',
    tableNo: '03',
    status: 'Cooking',
    startTime: new Date(now.getTime() - 1000 * 60 * 25),
    serverName: 'Mike R.',
    items: [{
      id: '11',
      name: 'Veggie Supreme',
      quantity: 1
    }, {
      id: '12',
      name: 'Greek Salad',
      quantity: 1
    }]
  }];
};
export default function KitchenDisplay() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [activeFilter, setActiveFilter] = useState<KitchenFilterType>('All');
  const [currentTime, setCurrentTime] = useState(new Date());
  // Initialize mock data
  useEffect(() => {
    setOrders(generateMockOrders());
    // Update clock every minute to force re-render of timers if needed
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  const handleStatusChange = (id: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        let nextStatus: OrderStatus = 'New';
        if (order.status === 'New') nextStatus = 'Cooking';else if (order.status === 'Cooking') nextStatus = 'Ready';else return order; // Can't advance past Ready in this view (would archive)
        return {
          ...order,
          status: nextStatus
        };
      }
      return order;
    }));
  };
  const filteredOrders = activeFilter === 'All' ? orders : orders.filter(o => o.status === activeFilter);
  // Sort: Late orders first, then by time
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Check lateness (20 mins)
    const now = new Date().getTime();
    const aElapsed = (now - a.startTime.getTime()) / 60000;
    const bElapsed = (now - b.startTime.getTime()) / 60000;
    if (aElapsed >= 20 && bElapsed < 20) return -1;
    if (bElapsed >= 20 && aElapsed < 20) return 1;
    return a.startTime.getTime() - b.startTime.getTime(); // Oldest first
  });
  const counts = {
    All: orders.length,
    New: orders.filter(o => o.status === 'New').length,
    Cooking: orders.filter(o => o.status === 'Cooking').length,
    Ready: orders.filter(o => o.status === 'Ready').length
  };
  return <MainLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-xl mb-6 shadow-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-black text-white tracking-tight">
            KDS <span className="text-[#EAB308]">PRO</span>
          </h1>
          <div className="h-8 w-[1px] bg-white/10" />
          <KitchenFilters activeFilter={activeFilter} counts={counts} onSelect={setActiveFilter} />
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">
            {currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          </div>
          <div className="text-xs font-medium text-white/40 uppercase tracking-widest">
            Kitchen Display
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto bg-[#121212] rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {sortedOrders.map(order => <OrderTicket key={order.id} order={order} onStatusChange={handleStatusChange} />)}
          </AnimatePresence>

          {sortedOrders.length === 0 && <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/20">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-xl font-medium">No active orders</p>
            </div>}
        </div>
      </div>
    </div>
    </MainLayout>;
}