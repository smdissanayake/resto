import React from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { MenuItemType } from './MenuItem';
export interface CartItem extends MenuItemType {
  quantity: number;
  modifiers?: any;
  specialInstructions?: string;
}
interface CartPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onPay: () => void;
  tables?: any[];
  selectedTableId?: string | null;
  onSelectTable?: (id: string | null) => void;
  discount?: number;
  onSetDiscount?: (discount: number) => void;
  onHoldOrder?: () => void;
}

export function CartPanel({
  cartItems,
  onUpdateQuantity,
  onPay,
  tables = [],
  selectedTableId,
  onSelectTable,
  discount = 0,
  onSetDiscount,
  onHoldOrder
}: CartPanelProps) {
  const { settings } = usePage().props as any;
  const currencySymbol = (settings as Record<string, string>)?.currency_symbol || '$';

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const grossTotal = subtotal + tax;
  const discountAmount = grossTotal * (discount / 100);
  const total = grossTotal - discountAmount;

  return <div className="h-full w-full bg-[#1A1A1A] flex flex-col border-l border-white/5">
    <div className="p-6 pb-4 border-b border-white/5">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-white">Current Order</h2>
        {/* Hold Order Button - Visible for both Takeaway and Table orders */}
        {onHoldOrder && cartItems.length > 0 && !selectedTableId && (
          <button
            onClick={onHoldOrder}
            className="text-blue-400 text-xs uppercase font-bold border border-blue-400/30 px-3 py-1 rounded hover:bg-blue-400/10 transition-colors"
          >
            Save / Pending
          </button>
        )}
      </div>

      {/* Table Selector */}
      <div className="mt-3">
        <select
          className="w-full bg-[#252525] text-white/80 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
          value={selectedTableId || ''}
          onChange={(e) => onSelectTable && onSelectTable(e.target.value || null)}
        >
          <option value="">Select Table (Optional)</option>
          {tables.map((table: any) => (
            <option key={table.id} value={table.id} disabled={table.status === 'occupied'}>
              {table.name} ({table.status})
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
      <AnimatePresence initial={false}>
        {cartItems.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-current rounded-md border-dashed" />
          </div>
          <p>No items added</p>
        </div> : cartItems.map(item => <motion.div key={item.id} layout initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          x: -50
        }} className="bg-[#252525] rounded-xl p-3 flex justify-between items-center group">
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-white font-medium text-sm truncate">
              {item.name}
            </h4>

            {/* Modifiers Display */}
            {(item.modifiers || item.specialInstructions) && (
              <div className="text-xs text-white/50 mt-1 space-y-0.5">
                {/* Size */}
                {item.modifiers?.size && (
                  <p>Size: <span className="text-white/70 capitalize">{item.modifiers.size}</span></p>
                )}

                {/* Addons */}
                {item.modifiers?.addons && item.modifiers.addons.length > 0 && (
                  <p>Addons: <span className="text-white/70">{item.modifiers.addons.join(', ')}</span></p>
                )}

                {/* Special Instructions */}
                {item.specialInstructions && (
                  <p className="italic text-[#FF6B00]/80">"{item.specialInstructions}"</p>
                )}
              </div>
            )}

            <p className="text-[#FF6B00] text-xs font-bold mt-1">
              {currencySymbol}{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-lg p-1">
            <motion.button whileTap={{
              scale: 0.9
            }} onClick={() => onUpdateQuantity(item.id, -1)} className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${item.quantity === 1 ? 'text-red-400 hover:bg-red-500/10' : 'text-white hover:bg-white/10'}`}>
              {item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
            </motion.button>

            <span className="text-white font-bold text-sm w-4 text-center">
              {item.quantity}
            </span>

            <motion.button whileTap={{
              scale: 0.9
            }} onClick={() => onUpdateQuantity(item.id, 1)} className="w-8 h-8 rounded-md flex items-center justify-center text-white bg-[#FF6B00] shadow-lg shadow-[#FF6B00]/20">
              <Plus size={16} />
            </motion.button>
          </div>
        </motion.div>)}
      </AnimatePresence>
    </div>

    <div className="p-6 bg-[#1A1A1A] border-t border-white/5">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-white/60 text-sm">
          <span>Subtotal</span>
          <span>{currencySymbol}{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white/60 text-sm">
          <span>Tax (8%)</span>
          <span>{currencySymbol}{tax.toFixed(2)}</span>
        </div>

        {/* Discount Toggle/Display */}
        <div className="flex justify-between text-white/60 text-sm items-center">
          <button
            onClick={() => onSetDiscount && onSetDiscount(discount === 0 ? 10 : 0)}
            className={`text-xs px-2 py-0.5 rounded border transition-colors ${discount > 0 ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 hover:border-white/40'}`}
            title="Toggle 10% Discount"
          >
            {discount > 0 ? 'Remove Discount' : 'Add Discount (10%)'}
          </button>
          {discount > 0 && (
            <span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)} ({discount}%)</span>
          )}
        </div>
        <div className="flex justify-between text-white text-xl font-bold pt-4 border-t border-white/10">
          <span>Total</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
      </div>

      <motion.button whileTap={{
        scale: 0.98
      }} onClick={onPay} disabled={cartItems.length === 0} className={`w-full py-5 rounded-xl text-white text-xl font-bold shadow-lg disabled:opacity-50 disabled:shadow-none transition-all ${selectedTableId ? 'bg-orange-500 shadow-orange-500/25' : 'bg-green-600 shadow-green-600/25'}`}>
        {selectedTableId ? 'PLACE ORDER' : 'PAY NOW'}
      </motion.button>
    </div>
  </div>;
}