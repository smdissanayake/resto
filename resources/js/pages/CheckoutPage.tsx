import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, CreditCard, QrCode, Truck, CheckCircle, ArrowLeft, Delete } from 'lucide-react';
import { PaymentMethodCard } from '../components/PaymentMethodCard';
import { NumericKeypad } from '../components/NumericKeypad';
import { CartItem } from '../components/CartPanel';
interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onComplete: (paymentMethod: string) => void;
}
type PaymentMethod = 'Cash' | 'Card' | 'QR' | 'Delivery';
export function CheckoutPage({
  cartItems,
  onBack,
  onComplete
}: CheckoutPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashAmount, setCashAmount] = useState<string>('');
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const handleKeyPress = (key: string) => {
    if (cashAmount.length < 8) {
      // Limit length
      setCashAmount(prev => prev + key);
    }
  };
  const handleDelete = () => {
    setCashAmount(prev => prev.slice(0, -1));
  };
  const formatCurrency = (amount: string) => {
    if (!amount) return '$0.00';
    const num = parseInt(amount) / 100;
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };
  const isReadyToPay = selectedMethod && (selectedMethod !== 'Cash' || selectedMethod === 'Cash' && cashAmount.length > 0);

  // Keyboard Event Listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Cash method is selected
      if (selectedMethod !== 'Cash') return;

      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        if (isReadyToPay && selectedMethod) {
          onComplete(selectedMethod);
        }
      } else if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMethod, cashAmount, isReadyToPay, onComplete, onBack]); // Dependencies are crucial here

  return <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col overflow-hidden">
    {/* Header / Back Button */}
    <div className="absolute top-8 left-8 z-20">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
        <ArrowLeft size={24} />
        <span className="text-lg font-medium">Back to Order</span>
      </button>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 flex items-center justify-center relative">
      {/* Payment Methods Grid (Hero) */}
      <div className="grid grid-cols-2 gap-6 p-8">
        <PaymentMethodCard id="Cash" label="Cash" icon={Banknote} isSelected={selectedMethod === 'Cash'} onSelect={id => setSelectedMethod(id as PaymentMethod)} />
        <PaymentMethodCard id="Card" label="Card" icon={CreditCard} isSelected={selectedMethod === 'Card'} onSelect={id => setSelectedMethod(id as PaymentMethod)} />
        <PaymentMethodCard id="QR" label="QR Code" icon={QrCode} isSelected={selectedMethod === 'QR'} onSelect={id => setSelectedMethod(id as PaymentMethod)} />
        <PaymentMethodCard id="Delivery" label="Delivery" icon={Truck} isSelected={selectedMethod === 'Delivery'} onSelect={id => setSelectedMethod(id as PaymentMethod)} />
      </div>

      {/* Floating Bill Summary (Top Right) */}
      <motion.div initial={{
        opacity: 0,
        x: 50
      }} animate={{
        opacity: 1,
        x: 0
      }} className="absolute top-8 right-8 w-[320px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20">
        <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar mb-4">
          {cartItems.map(item => <div key={item.id} className="flex justify-between text-sm text-white/80">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>)}
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-white/60 text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white text-2xl font-bold pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Complete Payment Button (Bottom Right) */}
      {selectedMethod !== 'Cash' && (
        <motion.button disabled={!isReadyToPay} whileTap={{
          scale: 0.98
        }} onClick={() => selectedMethod && onComplete(selectedMethod)} className={`
              absolute bottom-8 right-8 px-12 py-5 rounded-xl flex items-center gap-3 shadow-lg transition-all duration-300
              ${isReadyToPay ? 'bg-[#22C55E] text-white shadow-green-500/20 hover:brightness-110' : 'bg-white/10 text-white/40 cursor-not-allowed'}
            `}>
          <CheckCircle size={24} />
          <span className="text-xl font-bold">Complete Payment</span>
        </motion.button>
      )}
    </div>

    {/* Numeric Keypad Panel (Slide Up) */}
    <AnimatePresence>
      {selectedMethod === 'Cash' && <motion.div initial={{
        y: '100%'
      }} animate={{
        y: 0
      }} exit={{
        y: '100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200
      }} className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-white/10 p-6 z-30 flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-md flex flex-col items-center">
          <p className="text-white/60 text-base mb-2">Enter Cash Amount</p>
          <div className="text-4xl font-bold text-[#FF6B00] mb-6 min-h-[48px]">
            {formatCurrency(cashAmount)}
          </div>

          {/* Custom Keypad Layout for Horizontal Space */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="h-16 w-full rounded-full bg-white/5 border border-white/10 text-2xl font-bold text-white active:bg-[#FF6B00] active:border-[#FF6B00] transition-colors"
              >
                {key}
              </button>
            ))}

            {/* Bottom Row */}
            <button
              disabled={!isReadyToPay}
              onClick={() => selectedMethod && onComplete(selectedMethod)}
              className={`h-16 w-full rounded-full flex items-center justify-center font-bold text-lg transition-colors ${isReadyToPay ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 text-white/20'}`}
            >
              Pay
            </button>

            <button
              onClick={() => handleKeyPress('0')}
              className="h-16 w-full rounded-full bg-white/5 border border-white/10 text-2xl font-bold text-white active:bg-[#FF6B00] active:border-[#FF6B00] transition-colors"
            >
              0
            </button>

            <button
              onClick={handleDelete}
              className="h-16 w-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 active:bg-red-500/20 active:text-red-500 active:border-red-500/50 transition-colors"
            >
              <Delete size={24} />
            </button>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}