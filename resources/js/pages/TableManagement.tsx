import React, { useMemo, useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { TableData, TableStatus } from '../components/TableStatusCard';
import { TableFilters, FilterType } from '../components/TableFilters';
import { FloorPlanView } from '../components/FloorPlanView';
import { TableStatusGrid } from '../components/TableStatusGrid';
import { router, useForm } from '@inertiajs/react';
import { X, Save, Receipt as ReceiptIcon, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { Receipt } from '../components/Receipt';

// Backend Interface
interface DBTable {
  id: number;
  name: string;
  seats: number;
  status: string;
  position_x: number;
  position_y: number;
  current_order_id?: number | null;
  current_order?: {
    id: number;
    items: {
      id: number;
      product_name: string;
      quantity: number;
      unit_price: number;
    }[];
    total_amount: number;
    discount?: number;
    discount_type?: 'percentage' | 'fixed';
  } | null;
  waiter_name?: string | null;
  reservation_name?: string | null;
  reservation_time?: string | null;
}

interface PageProps {
  tables: DBTable[];
}

export default function TableManagement({ tables }: PageProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<TableData | null>(null); // New state
  const [filterStatus, setFilterStatus] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false); // New Move Modal State
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [settleDiscount, setSettleDiscount] = useState(0); // For settlement modal
  const [splitCount, setSplitCount] = useState(1);

  // Form for adding/editing table
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: '',
    seats: 4,
    position_x: 0,
    position_y: 0,
    waiter_name: '',
    reservation_name: '',
    reservation_time: ''
  });

  // Populate form when editing
  React.useEffect(() => {
    if (editingTable) {
      setData({
        name: editingTable.number,
        seats: editingTable.seats,
        position_x: editingTable.position.x,
        position_y: editingTable.position.y,
        waiter_name: editingTable.waiterName || '',
        reservation_name: editingTable.reservationName || '',
        reservation_time: editingTable.reservationTime || ''
      });
      setIsAddModalOpen(true);
    } else {
      reset();
      clearErrors();
    }
  }, [editingTable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTable) {
      put(`/tables/${editingTable.id}`, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setEditingTable(null);
          reset();
        }
      });
    } else {
      post('/tables', {
        onSuccess: () => {
          setIsAddModalOpen(false);
          reset();
        }
      });
    }
  };

  const openEditModal = (table: TableData) => {
    setEditingTable(table);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingTable(null);
    reset();
  };


  // Map DB tables to UI format
  const mappedTables = useMemo((): TableData[] => {
    return tables.map(t => ({
      id: t.id.toString(),
      number: t.name,
      status: t.status as TableStatus,
      seats: t.seats,
      position: {
        x: t.position_x,
        y: t.position_y
      },
      // Extended Data
      currentOrder: t.current_order,
      waiterName: t.waiter_name,
      reservationName: t.reservation_name,
      reservationTime: t.reservation_time,
    }));
  }, [tables]);

  // Filter Logic
  const filteredTables = useMemo(() => {
    return mappedTables.filter(table => {
      // Status Filter
      if (filterStatus !== 'all' && table.status !== filterStatus) return false;
      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = table.number.toLowerCase().includes(query);
        return matchesNumber;
      }
      return true;
    });
  }, [mappedTables, filterStatus, searchQuery]);

  // Stats Calculation
  const stats = useMemo(() => ({
    free: mappedTables.filter(t => t.status === 'free').length,
    occupied: mappedTables.filter(t => t.status === 'occupied').length,
    waiting: mappedTables.filter(t => t.status === 'waiting').length,
    total: mappedTables.length
  }), [mappedTables]);


  const handleClearTable = (id: string | number) => {
    // Check if there is an active order
    const table = mappedTables.find(t => t.id === id.toString());
    if (table && table.currentOrder && table.currentOrder.items.length > 0) {
      // Open Settlement Modal
      setSettleDiscount(0);
      setSplitCount(1);
      setIsSettlementModalOpen(true);
    } else {
      // No order? Just clear it (force clear)
      if (confirm('Are you sure you want to clear this table?')) {
        router.put(`/tables/${id}`, {
          status: 'free',
          current_order_id: null
        }, {
          onSuccess: () => setSelectedTableId(null)
        });
      }
    }
  };

  // Receipt state
  const [receiptData, setReceiptData] = useState<any | null>(null);

  // Trigger print when receipt data is ready
  React.useEffect(() => {
    if (receiptData) {
      setTimeout(() => {
        window.print();
        setReceiptData(null);
      }, 100);
    }
  }, [receiptData]);

  const confirmSettlement = () => {
    if (!selectedTableId || !selectedTable || !selectedTable.currentOrder) return;

    // Capture data for printing BEFORE the backend call clears it
    const dataToPrint = {
      orderNumber: `ORD-${selectedTable.currentOrder.id}`, // Placeholder or actual number if available
      date: new Date().toLocaleString(),
      items: selectedTable.currentOrder.items.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: Number(item.unit_price)
      })),
      subtotal: Number(selectedTable.currentOrder.total_amount) / 1.08,
      tax: Number(selectedTable.currentOrder.total_amount) - (Number(selectedTable.currentOrder.total_amount) / 1.08),
      total: Number(selectedTable.currentOrder.total_amount)
    };

    router.post(`/tables/${selectedTableId}/settle`, {
      payment_method: paymentMethod,
      discount: settleDiscount,
      discount_type: 'percentage'
    }, {
      onSuccess: () => {
        setIsSettlementModalOpen(false);
        setSelectedTableId(null);
        // Trigger Print
        setReceiptData(dataToPrint);
      }
    });
  };

  const selectedTable = mappedTables.find(t => t.id === selectedTableId);


  const handleUpdatePosition = (id: string, x: number, y: number) => {
    // Optimistic URL update or wait for server?
    // For now, direct PUT.
    router.put(`/tables/${id}`, {
      position_x: x,
      position_y: y
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        // Optional: Show toast
      }
    });
  };

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => { },
  });


  const handleMoveOrder = (targetId: string) => {
    if (!selectedTableId) return;

    const performMove = () => {
      router.post(`/tables/${selectedTableId}/move`, {
        target_table_id: targetId
      }, {
        onSuccess: () => {
          setIsMoveModalOpen(false);
          setSelectedTableId(null);
        }
      });
    };

    // Check if target is occupied to show confirmation for MERGE
    const targetTable = mappedTables.find(t => t.id === targetId);
    if (targetTable?.status === 'occupied') {
      setConfirmModal({
        isOpen: true,
        message: `Merge Table ${selectedTable?.number} into ${targetTable.number}? This will combine orders.`,
        onConfirm: performMove
      });
      return;
    }

    performMove();
  };

  return (
    <MainLayout>
      <Receipt data={receiptData} />
      <div className="h-[calc(100vh-100px)] w-full flex flex-col overflow-hidden relative print:hidden">
        {/* Header & Filters */}
        <TableFilters
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stats={stats}
          onAddTable={() => setIsAddModalOpen(true)}
        />

        {/* Main Content - Split View */}
        {/* Main Content - Split View */}
        <div className="flex-1 flex flex-col h-full overflow-hidden mt-4">
          {/* Top: Floor Plan (50%) - Mobile Scrollable */}
          <div className="h-1/2 w-full border border-white/5 rounded-xl overflow-hidden relative z-0 mb-4 bg-[#121212]">
            {/* Wrapper for scrolling large floorplans on mobile */}
            <div className="w-full h-full overflow-auto relative">
              <div className="min-w-[800px] min-h-[500px] h-full relative">
                <FloorPlanView
                  tables={filteredTables}
                  selectedId={selectedTableId}
                  onSelect={setSelectedTableId}
                  onUpdatePosition={handleUpdatePosition}
                />
              </div>
            </div>
          </div>

          {/* Bottom: Status Grid (50%) */}
          <div className="h-1/2 w-full relative z-10 bg-[#121212] overflow-y-auto">
            <TableStatusGrid tables={filteredTables} selectedId={selectedTableId} onSelect={setSelectedTableId} />
          </div>
        </div>

        {/* Table Details Sidebar/Overlay - Bottom Sheet on Mobile */}
        {selectedTable && (
          <div className="fixed inset-x-0 bottom-0 md:absolute md:top-20 md:right-4 md:bottom-auto md:w-96 bg-[#1A1A1A] border-t md:border border-white/10 md:rounded-xl rounded-t-2xl shadow-2xl p-6 z-50 max-h-[80vh] md:max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Table {selectedTable.number}</h2>
                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${selectedTable.status === 'free' ? 'bg-green-500/20 text-green-400' :
                  selectedTable.status === 'occupied' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                  {selectedTable.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(selectedTable)}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                  title="Edit Table"
                >
                  {/* Edit Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button onClick={() => setSelectedTableId(null)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">Seats</p>
                  <p className="text-lg font-bold text-white">{selectedTable.seats}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/40 mb-1">Waiter</p>
                  <p className="text-sm font-medium text-white">{selectedTable.waiterName || 'Not Assigned'}</p>
                </div>
              </div>

              {/* Order Details */}
              {selectedTable.status === 'occupied' && selectedTable.currentOrder ? (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-3 flex justify-between">
                    <span>Current Order</span>
                    <span className="text-[#FF6B00]">#{selectedTable.currentOrder.id}</span>
                  </h3>
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedTable.currentOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white/80">{item.quantity}x {item.product_name}</span>
                        <span className="text-white/60">${(item.unit_price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span>${Number(selectedTable.currentOrder.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              ) : selectedTable.status === 'occupied' ? (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-200 text-sm">
                  Order data loading or not linked...
                </div>
              ) : null}

              {/* Reservation Info Display */}
              {selectedTable.reservationName && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                  <h4 className="text-blue-400 font-bold text-sm mb-2">Reservation</h4>
                  <p className="text-white text-sm">Guest: {selectedTable.reservationName}</p>
                  <p className="text-white/60 text-xs">Time: {selectedTable.reservationTime}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {selectedTable.status === 'occupied' ? (
                <div className="space-y-3">
                  <button
                    onClick={() => router.visit(`/pos?table_id=${selectedTable.id}`)}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Add Items / Modify Order</span>
                  </button>
                  <button
                    onClick={() => setIsMoveModalOpen(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft size={18} />
                    <span>Move / Merge Table</span>
                  </button>
                  <button
                    onClick={() => handleClearTable(selectedTable.id)}
                    className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 rounded-lg font-medium transition-colors"
                  >
                    Clear Table & Mark Free
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => router.visit(`/pos?table_id=${selectedTable.id}`)}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Take Order</span>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openEditModal(selectedTable)}
                      className="py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/5"
                    >
                      Reserve / Edit
                    </button>
                    <button
                      onClick={() => openEditModal(selectedTable)}
                      className="py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm border border-white/5"
                    >
                      Assign Waiter
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this table?')) {
                    router.delete(`/tables/${selectedTable.id}`, { onSuccess: () => setSelectedTableId(null) });
                  }
                }}
                className="w-full py-3 mt-4 text-white/20 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <X size={14} /> Delete Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingTable ? 'Edit Table' : 'Add New Table'}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Table Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    placeholder="T-10"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Seats</label>
                  <input
                    type="number"
                    value={data.seats}
                    onChange={e => setData('seats', parseInt(e.target.value))}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    min="1"
                  />
                  {errors.seats && <p className="text-red-500 text-xs mt-1">{errors.seats}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h3 className="text-sm font-bold text-white/60 mb-3">Operational Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Waiter Name</label>
                  <input
                    type="text"
                    value={data.waiter_name}
                    onChange={e => setData('waiter_name', e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Assign Waiter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Reservation Name</label>
                  <input
                    type="text"
                    value={data.reservation_name}
                    onChange={e => setData('reservation_name', e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Guest Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                  <input
                    type="datetime-local"
                    value={data.reservation_time}
                    onChange={e => setData('reservation_time', e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? 'Saving...' : <> <Save size={18} /> {editingTable ? 'Update Table' : 'Create Table'} </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Settlement Modal */}
      {isSettlementModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ReceiptIcon className="text-orange-500" />
                  Bill Settlement
                </h2>
                <p className="text-white/40 text-sm mt-1">Table {selectedTable.number}</p>
              </div>
              <button onClick={() => setIsSettlementModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Order Summary */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {selectedTable.currentOrder?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white/80">{item.quantity}x {item.product_name}</span>
                      <span className="text-white/60">${(item.quantity * item.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculations */}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>${Number(selectedTable.currentOrder?.total_amount || 0).toFixed(2)}</span>
                </div>

                {/* Discount Input */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Discount (%)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settleDiscount}
                      onChange={(e) => setSettleDiscount(Number(e.target.value))}
                      className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-right focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-end border-t border-white/10 pt-2">
                  <span className="text-white font-bold">Total To Pay</span>
                  <span className="text-2xl font-bold text-green-400">
                    ${(Number(selectedTable.currentOrder?.total_amount || 0) * (1 - settleDiscount / 100)).toFixed(2)}
                  </span>
                </div>

                {/* Split Bill Calculator */}
                <div className="bg-white/5 rounded-lg p-3 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Split Bill</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20">-</button>
                      <span className="text-white font-bold w-4 text-center">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-orange-400 font-bold">
                    <span>Per Person:</span>
                    <span>${((Number(selectedTable.currentOrder?.total_amount || 0) * (1 - settleDiscount / 100)) / splitCount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <p className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Payment Method</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash'
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
              >
                <Banknote size={24} />
                <span className="font-bold">CASH</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
              >
                <CreditCard size={24} />
                <span className="font-bold">CARD</span>
              </button>
            </div>

            <button
              onClick={confirmSettlement}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Pay & Close Table</span>
            </button>
          </div>
        </div>
      )}
      {/* Move/Merge Modal */}
      {isMoveModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-4xl border border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="text-blue-500" />
                  Move / Merge Table {selectedTable.number}
                </h2>
                <p className="text-white/40 text-sm mt-1">Select a target table to move or merge orders.</p>
              </div>
              <button onClick={() => setIsMoveModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mappedTables.filter(t => t.id !== selectedTable.id).map(table => (
                <button
                  key={table.id}
                  onClick={() => handleMoveOrder(table.id)}
                  className={`
                                p-4 rounded-xl border flex flex-col items-center gap-2 transition-all group relative
                                ${table.status === 'free'
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500'
                      : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500'}
                            `}
                >
                  <span className="text-2xl font-bold text-white mb-1">{table.number}</span>
                  <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded ${table.status === 'free' ? 'bg-green-500 text-black' : 'bg-orange-500 text-white'
                    }`}>
                    {table.status === 'free' ? 'Move Here' : 'Merge Here'}
                  </span>
                  {table.currentOrder && (
                    <span className="text-xs text-white/40 mt-1">${Number(table.currentOrder.total_amount).toFixed(2)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="text-orange-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Action</h3>
              <p className="text-white/60 text-sm mb-6">{confirmModal.message}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
                  className="flex-1 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
                  }}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}