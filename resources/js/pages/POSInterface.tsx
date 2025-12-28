import React, { useState, useEffect } from 'react';
import { CategorySidebar } from '../components/CategorySidebar';
import { MenuItemGrid } from '../components/MenuItemGrid';
import { CartPanel, CartItem } from '../components/CartPanel';
import { MenuItemType } from '../components/MenuItem';
import { CheckoutPage } from './CheckoutPage';
import { ProductModifierModal } from '../components/ProductModifierModal';
import { router, usePage } from '@inertiajs/react';
import { Receipt, ReceiptData } from '../components/Receipt';
import { Search, History, Trash2, X, Clock, AlertTriangle } from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';

interface Props {
  products: any[];
  tables?: any[];
  tableId?: string;
  pendingOrders?: any[]; // Orders passed from backend
}

export default function POSInterface({ products, tables = [], tableId, pendingOrders = [] }: Props) {
  const { flash, settings } = usePage().props as any;
  const currencySymbol = (settings as Record<string, string>)?.currency_symbol || '$';
  const [activeCategory, setActiveCategory] = useState('Burgers');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [discount, setDiscount] = useState(0);

  // Track if we are editing an existing order
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Open Orders State (Backend Driven)
  const [isOpenOrdersModalOpen, setIsOpenOrdersModalOpen] = useState(false);

  // Initialize with prop or null
  const [selectedTableId, setSelectedTableId] = useState<string | null>(tableId || null);

  // If tableId prop changes (navigated to), update state
  useEffect(() => {
    if (tableId) setSelectedTableId(tableId);
  }, [tableId]);

  // Receipt state
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  // Watch for successful order in flash messages
  useEffect(() => {
    if (flash?.order) {
      const order = flash.order;

      // Only print receipt for Paid Takeaway orders automatically
      // If payment_status is 'unpaid' (pending), likely don't print yet unless requested?
      // Or maybe print a 'Ticket'? For now, restrict auto-print to Paid.
      if (order.dining_table_id) return;
      if (order.payment_status !== 'paid') return;

      const data: ReceiptData = {
        orderNumber: order.order_number,
        date: new Date(order.created_at).toLocaleString(),
        items: order.items.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: Number(item.unit_price)
        })),
        subtotal: Number(order.total_amount) / 1.08,
        tax: Number(order.total_amount) - (Number(order.total_amount) / 1.08),
        total: Number(order.total_amount)
      };
      setReceiptData(data);
    }
  }, [flash]);

  // Trigger print when receipt data is ready
  useEffect(() => {
    if (receiptData) {
      setTimeout(() => {
        window.print();
        setReceiptData(null);
      }, 100);
    }
  }, [receiptData]);

  const menuItems: MenuItemType[] = products.map(p => ({
    id: p.id.toString(),
    name: p.name,
    price: Number(p.price),
    category: p.category,
    image: p.image || 'https://via.placeholder.com/150',
    modifiers: p.modifiers
  }));

  const filteredItems = searchQuery
    ? menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems.filter(item => item.category === activeCategory);

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };

  const handleAddToCartFromModal = (item: MenuItemType, modifiers: any, quantity: number, specialInstructions: string) => {
    setCartItems(prev => {
      const newItem: CartItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        quantity: quantity,
        price: item.price,
        modifiers: modifiers,
        specialInstructions: specialInstructions
      };
      return [...prev, newItem];
    });
    setSelectedItem(null);
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? {
            ...item,
            quantity: newQuantity
          } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const submitOrder = (paymentMethod: string) => {
    const payload = {
      items: cartItems.map(item => ({
        id: item.id,
        product_id: item.id.split('-')[0],
        quantity: item.quantity,
        modifiers: (item as any).modifiers,
        specialInstructions: (item as any).specialInstructions
      })),
      dining_table_id: selectedTableId,
      payment_method: paymentMethod.toLowerCase(),
      discount: discount,
      discount_type: 'percentage',
      order_id: activeOrderId // If null, creates new. If set, updates existing.
    };

    router.post('/pos/order', payload, {
      onSuccess: () => {
        setCartItems([]);
        setIsCheckout(false);
        setSelectedTableId(null);
        setActiveOrderId(null); // Reset active order
        setDiscount(0);
      },
      onError: (errors) => {
        console.error(errors);
        showToast('Failed to process order. Please try again.', 'error');
      }
    });
  };

  const handleSaveOrder = () => {
    if (cartItems.length === 0) return;
    // Call backend to save as pending
    submitOrder('pending');
  };

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => { },
  });

  const handleRecallOrder = (order: any) => {
    const proceed = () => {
      // Map backend items to Frontend Cart Format
      const mappedItems: CartItem[] = order.items.map((item: any) => {
        const originalProduct = products.find(p => p.id === item.product_id);
        return {
          id: `${item.product_id}-${Date.now()}-${Math.random()}`,
          name: item.product_name,
          price: Number(item.unit_price),
          category: originalProduct?.category || 'Uncategorized',
          image: originalProduct?.image || '',
          quantity: item.quantity,
          modifiers: item.modifiers,
          specialInstructions: item.special_instructions
        };
      });

      setCartItems(mappedItems);
      setDiscount(order.discount || 0);
      setSelectedTableId(order.dining_table_id || null);
      setActiveOrderId(order.id);
      setIsOpenOrdersModalOpen(false);
      showToast(`Order #${order.order_number} loaded!`);
    };

    if (cartItems.length > 0) {
      setConfirmModal({
        isOpen: true,
        message: 'Current cart will be replaced. Continue?',
        onConfirm: proceed
      });
      return;
    }

    proceed();
  };

  const handleCancelOrder = (id: number) => {
    setConfirmModal({
      isOpen: true,
      message: 'Void this order? Kitchen will be notified.',
      onConfirm: () => {
        router.post(`/pos/orders/${id}/cancel`, {}, {
          onSuccess: () => {
            showToast('Order Voided Successfully');
          },
          onError: () => showToast('Failed to void order', 'error')
        });
      }
    });
  };

  const handlePay = () => {
    if (cartItems.length > 0) {
      if (selectedTableId) {
        // Direct Submit for Tables (Dine-in)
        submitOrder('pay_later');
      } else {
        setIsCheckout(true);
      }
    }
  };

  const handleCheckoutComplete = (paymentMethod: string) => {
    submitOrder(paymentMethod);
  };

  if (isCheckout) {
    return <CheckoutPage cartItems={cartItems} onBack={() => setIsCheckout(false)} onComplete={handleCheckoutComplete} />;
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      <Receipt data={receiptData} />

      <div className="h-screen w-full bg-[#121212] flex overflow-hidden select-none print:hidden">
        {/* Left Column: Categories (15%) */}
        <div className="w-[15%] h-full flex-shrink-0 z-20">
          <CategorySidebar
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            categories={Array.from(new Set(menuItems.map(item => item.category)))}
          />
        </div>

        {/* Center Column: Menu Grid (60%) */}
        <div className="w-[60%] h-full flex flex-col bg-[#121212] relative z-10">
          <div className="px-6 pt-6 pb-2 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {searchQuery ? `Searching "${searchQuery}"` : activeCategory}
              </h1>
              <div className="flex gap-2 mt-1">
                <p className="text-white/40 text-sm">{filteredItems.length} items available</p>
                {activeOrderId && (
                  <span className="text-orange-400 text-sm font-bold animate-pulse">
                    • Editing Order #{activeOrderId}
                  </span>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpenOrdersModalOpen(true)}
                className="h-10 px-4 flex items-center justify-center gap-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10"
                title="Recall Orders"
              >
                <Clock size={18} />
                <span className="text-sm font-bold">{pendingOrders.length}</span>
              </button>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-white/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <span className="text-xs font-bold">ESC</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <MenuItemGrid items={filteredItems} onAdd={handleItemClick} />
        </div>

        {/* Right Column: Cart (25%) */}
        <div className="w-[25%] h-full flex-shrink-0 z-30 shadow-2xl shadow-black/50">
          <CartPanel
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onPay={handlePay}
            tables={tables}
            selectedTableId={selectedTableId}
            onSelectTable={setSelectedTableId}
            discount={discount}
            onSetDiscount={setDiscount}
            onHoldOrder={handleSaveOrder} // Renamed action
          />
        </div>

        {/* Modifiers Modal */}
        <ProductModifierModal
          isOpen={selectedItem !== null}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCartFromModal}
        />

        {/* Open Orders Modal (Replaces Held Orders) */}
        {isOpenOrdersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#252525]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="text-blue-500" />
                  Open Takeaway Orders
                </h2>
                <button onClick={() => setIsOpenOrdersModalOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {pendingOrders.length === 0 ? (
                  <div className="text-center text-white/40 py-10">No pending takeaway orders</div>
                ) : (
                  pendingOrders.map((order: any) => (
                    <div key={order.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[#FF6B00] font-bold text-xl">
                            #{order.order_number}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs uppercase font-bold bg-blue-500/20 text-blue-400">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-white/70 mb-1">
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                        <div className="text-white font-bold mb-1">
                          {currencySymbol}{Number(order.total_amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-white/30 truncate max-w-md">
                          {order.items.map((i: any) => i.product_name).join(', ')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRecallOrder(order)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20"
                        >
                          Recall & Pay
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/30 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Trash2 size={16} />
                          Void
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500 w-8 h-8" />
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
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}