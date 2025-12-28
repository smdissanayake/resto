import React, { useEffect, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { KitchenFilters, KitchenFilterType } from '../components/KitchenFilters';
import { OrderTicket, OrderType, OrderStatus } from '../components/OrderTicket';
import { router, usePage } from '@inertiajs/react';
import { Volume2, VolumeX, RotateCcw, History, X } from 'lucide-react';

// ... imports ...

interface Props {
  orders: any[]; // We can be more specific, but 'any' is safe for now to match structure
  history?: any[]; // Lazy loaded
}

export default function KitchenDisplay({ orders: initialOrders, history }: Props) {
  // We use initialOrders properly, but Inertia updates props automatically on reload.
  // Actually, better to just access from props directly or state.
  // Let's rely on props.

  const orders = initialOrders as OrderType[];

  const [activeFilter, setActiveFilter] = useState<KitchenFilterType>('All');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Polling for new orders
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['orders'] });
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Sound Notification Logic
  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const prevOrdersRef = React.useRef<Set<string | number>>(new Set());
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  // Check for new orders
  useEffect(() => {
    const currentIds = new Set(orders.map(o => o.id));

    // Check if we have any NEW orders that weren't there before
    const hasNewOrders = orders.some(o =>
      !prevOrdersRef.current.has(o.id) && o.status === 'New'
    );

    if (hasNewOrders && isSoundEnabled && prevOrdersRef.current.size > 0) {
      // Play sound
      audioRef.current?.play().catch(e => console.log('Audio play failed (interaction needed):', e));
    }

    // Update ref
    prevOrdersRef.current = currentIds;
  }, [orders, isSoundEnabled]);

  const [showHistory, setShowHistory] = useState(false);

  const handleUndo = (id: string | number) => {
    router.put(`/kitchen/${id}?undo=true`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        if (showHistory) {
          router.reload({ only: ['orders', 'history'] });
        }
      }
    });
  };

  const toggleHistory = () => {
    if (!showHistory) {
      router.reload({ only: ['history'] });
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  const handleStatusChange = (id: string) => {
    // Find the order, though we are about to mutate via server
    const order = orders.find(o => o.id === id || o.id === Number(id));
    // Note: Controller returns ID as int, frontend mock uses string. 
    // We should handle both or ensure types match. 
    // The router.put expects the ID.

    router.put(`/kitchen/${id}`, {}, {
      preserveScroll: true,
      // Optimistic update could happen here but reload is safer for sync
    });
  };

  const filteredOrders = activeFilter === 'All' ? orders : orders.filter(o => o.status === activeFilter);

  // Sort: Late orders first, then by time
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Check lateness (20 mins)
    const now = new Date().getTime();
    const aTime = new Date(a.startTime).getTime();
    const bTime = new Date(b.startTime).getTime();

    const aElapsed = (now - aTime) / 60000;
    const bElapsed = (now - bTime) / 60000;

    // Priority for late orders
    if (aElapsed >= 20 && bElapsed < 20) return -1;
    if (bElapsed >= 20 && aElapsed < 20) return 1;

    return aTime - bTime; // Oldest first
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
      {/* Top Bar */}
      <div className="px-4 py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-xl mb-4 md:mb-6 shadow-xl gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
          {/* Mobile Header Row */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-2xl font-black text-white tracking-tight">
              KDS <span className="text-[#EAB308]">PRO</span>
            </h1>
            {/* Clock visible on mobile in header row */}
            <div className="md:hidden text-white/60 font-mono font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-white/10" />

          {/* Scrollable Filters for Mobile */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <KitchenFilters activeFilter={activeFilter} counts={counts} onSelect={setActiveFilter} />

            {/* History Toggle Button */}
            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
            <button
              onClick={toggleHistory}
              className={`
                   px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap
                   ${showHistory ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}
                `}
            >
              <History size={16} />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Desktop Clock */}
        <div className="hidden md:flex items-center gap-6 text-right">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!isSoundEnabled)}
            className={`p-3 rounded-full transition-all ${isSoundEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-400'}`}
            title={isSoundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>

          <div>
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

      {/* History Slide-over Panel */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 rounded-xl"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 bottom-0 w-full md:w-[480px] bg-[#1A1A1A] border-l border-white/10 z-50 shadow-2xl flex flex-col rounded-r-xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#121212]">
                <div>
                  <h2 className="text-xl font-bold text-white">Completed Orders</h2>
                  <p className="text-sm text-white/40">Recently served items</p>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(!history || history.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/20">
                    <History size={48} className="mb-4" />
                    <p>No recently completed orders</p>
                  </div>
                ) : (
                  history.map((order: OrderType) => (
                    <div key={order.id} className="bg-[#121212] border border-white/5 rounded-xl p-4 flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white text-lg">T-{order.tableNo}</span>
                          <span className="text-xs font-mono text-white/40">#{String(order.id).slice(-4)}</span>
                        </div>
                        <p className="text-sm text-green-400 font-bold mb-2">Served: {new Date(order.startTime).toLocaleTimeString()}</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-white/70">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center border-l border-white/10 pl-4">
                        <button
                          onClick={() => handleUndo(Number(order.id))}
                          className="p-3 bg-white/5 hover:bg-white/10 text-orange-400 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                          title="Undo / Send Back to Kitchen"
                        >
                          <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform" />
                          <span className="text-[10px] font-bold uppercase">Undo</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  </MainLayout>;
}