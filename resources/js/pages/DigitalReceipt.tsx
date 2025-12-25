import React from 'react';
import { Instagram, Facebook, Twitter, Star } from 'lucide-react';
export function DigitalReceipt() {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  return <div className="min-h-screen w-full bg-[#E0E0E0] flex items-center justify-center p-4 font-mono">
      {/* Receipt Container */}
      <div className="w-full max-w-[380px] bg-white text-black relative shadow-2xl overflow-hidden">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

        {/* Jagged Top Edge (CSS Clip Path) */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#E0E0E0] z-20" style={{
        clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'
      }} />

        <div className="p-6 pt-10 pb-10 relative z-0">
          {/* Header */}
          <div className="text-center mb-6 space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">
              Resto SaaS
              <br />
              Restaurant
            </h1>
            <p className="text-xs uppercase">123 Main Street</p>
            <p className="text-xs uppercase">City, ST 12345</p>
            <p className="text-xs uppercase">(555) 123-4567</p>
          </div>

          {/* Meta Info */}
          <div className="border-t-2 border-dashed border-black py-3 mb-3 text-xs uppercase space-y-1">
            <div className="flex justify-between">
              <span>Date: {currentDate}</span>
              <span>Time: {currentTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Order #: 2045</span>
              <span>Table: 12</span>
            </div>
            <div className="flex justify-between">
              <span>Server: Sarah J.</span>
              <span>Guests: 2</span>
            </div>
          </div>

          {/* Items List */}
          <div className="border-t-2 border-dashed border-black py-4 space-y-2 text-sm uppercase">
            <div className="flex justify-between items-start">
              <span className="flex-1">2x Classic Smash Burger</span>
              <span className="font-bold">$25.98</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="flex-1">1x Caesar Salad</span>
              <span className="font-bold">$10.99</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="flex-1">2x Craft Cola</span>
              <span className="font-bold">$5.98</span>
            </div>
            {/* Modifiers (indented) */}
            <div className="text-xs text-gray-600 pl-4">
              <p>- No Ice</p>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-dashed border-black py-4 space-y-1 text-sm uppercase">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$42.95</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>$3.44</span>
            </div>
            <div className="flex justify-between">
              <span>Service (15%)</span>
              <span>$6.44</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t-4 border-dashed border-black py-4 mb-6">
            <div className="flex justify-between items-center text-2xl font-bold uppercase">
              <span>Total</span>
              <span>$52.83</span>
            </div>
          </div>

          {/* Footer / Feedback */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="font-bold uppercase text-sm">
                Rate Your Experience
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} className="stroke-black fill-transparent stroke-[1.5px]" />)}
              </div>
            </div>

            <div className="flex justify-center gap-6 py-2">
              <Instagram size={20} className="stroke-black stroke-[1.5px]" />
              <Facebook size={20} className="stroke-black stroke-[1.5px]" />
              <Twitter size={20} className="stroke-black stroke-[1.5px]" />
            </div>

            <div className="space-y-1 pt-2">
              <p className="text-xs uppercase font-bold">
                Thank You for Dining With Us!
              </p>
              <p className="text-[10px] uppercase">
                Please retain receipt for your records
              </p>
              <p className="text-[10px] uppercase pt-2">www.restosaas.com</p>
            </div>

            {/* Barcode Placeholder */}
            <div className="pt-4 flex justify-center">
              <div className="h-12 w-48 bg-black/10 flex items-center justify-center">
                <div className="flex h-full w-full items-end justify-center gap-[2px] px-2 pb-1">
                  {Array.from({
                  length: 40
                }).map((_, i) => <div key={i} className="bg-black h-full" style={{
                  width: Math.random() > 0.5 ? '2px' : '4px',
                  height: Math.random() > 0.8 ? '80%' : '100%'
                }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jagged Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#E0E0E0] z-20 rotate-180" style={{
        clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'
      }} />
      </div>
    </div>;
}