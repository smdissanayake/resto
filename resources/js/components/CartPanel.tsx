import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { MenuItemType } from './MenuItem';
export interface CartItem extends MenuItemType {
  quantity: number;
}
interface CartPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onPay: () => void;
}
export function CartPanel({
  cartItems,
  onUpdateQuantity,
  onPay
}: CartPanelProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  return <div className="h-full w-full bg-[#1A1A1A] flex flex-col border-l border-white/5">
      <div className="p-6 pb-4 border-b border-white/5">
        <h2 className="text-2xl font-bold text-white">Current Order</h2>
        <p className="text-white/40 text-sm mt-1">Order #2045</p>
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
                  <p className="text-[#FF6B00] text-xs font-bold mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white text-xl font-bold pt-4 border-t border-white/10">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <motion.button whileTap={{
        scale: 0.98
      }} onClick={onPay} disabled={cartItems.length === 0} className="w-full py-5 bg-[#FF6B00] rounded-xl text-white text-xl font-bold shadow-lg shadow-[#FF6B00]/25 disabled:opacity-50 disabled:shadow-none transition-all">
          PAY NOW
        </motion.button>
      </div>
    </div>;
}