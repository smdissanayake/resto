import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaffSelector, StaffMember } from '../components/StaffSelector';
import { NumericKeypad } from '../components/NumericKeypad';
// Mock Data
const STAFF_MEMBERS: StaffMember[] = [{
  id: '1',
  name: 'Sarah',
  initials: 'SJ',
  color: 'bg-blue-500'
}, {
  id: '2',
  name: 'Mike',
  initials: 'MR',
  color: 'bg-green-500'
}, {
  id: '3',
  name: 'Alex',
  initials: 'AL',
  color: 'bg-purple-500'
}, {
  id: '4',
  name: 'Jordan',
  initials: 'JP',
  color: 'bg-yellow-500'
}];
export function StaffPinLogin() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(STAFF_MEMBERS[0].id);
  const [pin, setPin] = useState<string[]>([]);
  const [error, setError] = useState(false);
  // Reset PIN when switching users
  useEffect(() => {
    setPin([]);
    setError(false);
  }, [selectedStaffId]);
  const handleKeyPress = (key: string) => {
    if (!selectedStaffId) return; // Must select staff first
    if (pin.length < 4) {
      const newPin = [...pin, key];
      setPin(newPin);
      // Auto-submit or validate when 4 digits reached
      if (newPin.length === 4) {
        // Simulate validation
        setTimeout(() => {
          console.log(`Validating PIN ${newPin.join('')} for user ${selectedStaffId}`);
          // Reset for demo purposes
          setPin([]);
        }, 300);
      }
    }
  };
  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };
  const handleSwitchUser = () => {
    setSelectedStaffId(null);
    setPin([]);
  };
  return <div className="min-h-screen w-full bg-[#121212] flex flex-col items-center justify-between py-8 relative overflow-hidden select-none">
      {/* Background Noise/Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }} />

      {/* Top Section: Staff Selector */}
      <div className="w-full relative z-10 flex-shrink-0">
        <StaffSelector staff={STAFF_MEMBERS} selectedId={selectedStaffId} onSelect={setSelectedStaffId} />
      </div>

      {/* Middle Section: PIN Dots */}
      <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10 min-h-[120px]">
        <div className="flex gap-6 mb-8">
          {[0, 1, 2, 3].map(index => {
          const isFilled = index < pin.length;
          return <motion.div key={index} initial={false} animate={{
            scale: isFilled ? 1 : 0.8,
            backgroundColor: isFilled ? '#FF6B00' : 'transparent',
            borderColor: isFilled ? '#FF6B00' : 'rgba(255,255,255,0.2)'
          }} className="w-5 h-5 rounded-full border-2 transition-colors duration-200" />;
        })}
        </div>

        <AnimatePresence>
          {!selectedStaffId && <motion.p initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} className="text-white/40 text-sm font-medium">
              Select a staff member to login
            </motion.p>}
        </AnimatePresence>
      </div>

      {/* Bottom Section: Keypad */}
      <div className="w-full relative z-10 pb-8 flex flex-col items-center gap-8">
        <div className={!selectedStaffId ? 'opacity-50 pointer-events-none grayscale transition-all duration-300' : 'transition-all duration-300'}>
          <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
        </div>

        <button onClick={handleSwitchUser} className="text-white/40 text-sm font-medium hover:text-white transition-colors py-2 px-4 rounded-lg active:bg-white/5">
          Switch User
        </button>
      </div>
    </div>;
}