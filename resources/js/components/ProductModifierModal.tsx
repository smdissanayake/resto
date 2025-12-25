import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItemType } from './MenuItem';
interface Modifier {
  id: string;
  name: string;
  price: number;
}
interface ModifierSection {
  title: string;
  type: 'single' | 'multiple';
  options: Modifier[];
}
interface ProductModifierModalProps {
  isOpen: boolean;
  item: MenuItemType | null;
  onClose: () => void;
  onAddToCart: (item: MenuItemType, modifiers: any, quantity: number, specialInstructions: string) => void;
}
export function ProductModifierModal({
  isOpen,
  item,
  onClose,
  onAddToCart
}: ProductModifierModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [specialInstructions, setSpecialInstructions] = useState('');
  if (!item) return null;
  // Mock modifier data - in real app, this would come from item data
  const modifierSections: ModifierSection[] = [{
    title: 'Size',
    type: 'single',
    options: [{
      id: 'small',
      name: 'Small',
      price: -2.0
    }, {
      id: 'medium',
      name: 'Medium',
      price: 0
    }, {
      id: 'large',
      name: 'Large',
      price: 2.5
    }, {
      id: 'xlarge',
      name: 'Extra Large',
      price: 4.0
    }]
  }, {
    title: 'Add-ons',
    type: 'multiple',
    options: [{
      id: 'extra-cheese',
      name: 'Extra Cheese',
      price: 1.5
    }, {
      id: 'bacon',
      name: 'Bacon',
      price: 2.0
    }, {
      id: 'avocado',
      name: 'Avocado',
      price: 2.5
    }, {
      id: 'extra-patty',
      name: 'Extra Patty',
      price: 4.0
    }, {
      id: 'grilled-onions',
      name: 'Grilled Onions',
      price: 1.0
    }, {
      id: 'jalapeños',
      name: 'Jalapeños',
      price: 0.75
    }]
  }];
  const handleToggleAddon = (addonId: string) => {
    const newAddons = new Set(selectedAddons);
    if (newAddons.has(addonId)) {
      newAddons.delete(addonId);
    } else {
      newAddons.add(addonId);
    }
    setSelectedAddons(newAddons);
  };
  const calculateTotal = () => {
    let total = item.price;
    // Add size modifier
    const sizeOption = modifierSections[0].options.find(o => o.id === selectedSize);
    if (sizeOption) total += sizeOption.price;
    // Add selected add-ons
    modifierSections[1].options.forEach(addon => {
      if (selectedAddons.has(addon.id)) {
        total += addon.price;
      }
    });
    return total * quantity;
  };
  const handleSubmit = () => {
    onAddToCart(item, {
      size: selectedSize,
      addons: Array.from(selectedAddons)
    }, quantity, specialInstructions);
    // Reset state
    setQuantity(1);
    setSelectedSize('medium');
    setSelectedAddons(new Set());
    setSpecialInstructions('');
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{
        scale: 0.9,
        opacity: 0,
        y: 20
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.9,
        opacity: 0,
        y: 20
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} onClick={e => e.stopPropagation()} className="w-full max-w-5xl h-[85vh] bg-[#1A1A1A]/95 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex">
            {/* Left Side - Product Image (40%) */}
            <div className="w-[40%] relative overflow-hidden bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

              {/* Product Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h2 className="text-4xl font-bold text-white mb-2 leading-tight">
                  {item.name}
                </h2>
                <p className="text-white/60 text-lg">Customize your order</p>
              </div>

              {/* Close Button */}
              <button onClick={onClose} className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Right Side - Modifiers (60%) */}
            <div className="w-[60%] flex flex-col bg-[#121212]/50">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Quantity Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <motion.button whileTap={{
                  scale: 0.95
                }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                      <Minus size={20} />
                    </motion.button>
                    <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <motion.button whileTap={{
                  scale: 0.95
                }} onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-full bg-[#FF6B00] border border-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-[#FF6B00]/25 hover:bg-[#ff8533] transition-colors">
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Modifier Sections */}
                {modifierSections.map((section, sectionIndex) => <div key={sectionIndex} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      {section.type === 'single' && <span className="text-xs text-white/40">
                          Select one
                        </span>}
                      {section.type === 'multiple' && <span className="text-xs text-white/40">
                          Select any
                        </span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {section.options.map(option => {
                  const isSelected = section.type === 'single' ? selectedSize === option.id : selectedAddons.has(option.id);
                  return <motion.button key={option.id} whileTap={{
                    scale: 0.97
                  }} onClick={() => {
                    if (section.type === 'single') {
                      setSelectedSize(option.id);
                    } else {
                      handleToggleAddon(option.id);
                    }
                  }} className={`
                              px-4 py-3.5 rounded-full text-sm font-medium transition-all duration-200
                              border-2 flex items-center justify-between
                              ${isSelected ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'}
                            `}>
                            <span>{option.name}</span>
                            {option.price !== 0 && <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                {option.price > 0 ? '+' : ''}
                                {option.price.toFixed(2)}
                              </span>}
                          </motion.button>;
                })}
                    </div>
                  </div>)}

                {/* Special Instructions */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                    Special Instructions
                  </label>
                  <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} placeholder="Any special requests? (e.g., no pickles, extra sauce)" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B00]/50 focus:ring-2 focus:ring-[#FF6B00]/25 transition-all resize-none" rows={3} />
                </div>
              </div>

              {/* Fixed Bottom - Add to Cart */}
              <div className="p-8 bg-gradient-to-t from-[#121212] to-transparent border-t border-white/5">
                <motion.button whileTap={{
              scale: 0.98
            }} onClick={handleSubmit} className="w-full py-5 bg-[#FF6B00] rounded-2xl text-white font-bold text-lg shadow-2xl shadow-[#FF6B00]/30 hover:bg-[#ff8533] transition-colors flex items-center justify-between px-6">
                  <span>Add to Order</span>
                  <span className="text-2xl">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}