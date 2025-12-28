import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Grid3x3, Delete } from 'lucide-react';
import { router } from '@inertiajs/react';

export function LoginForm() {
  const [mode, setMode] = useState<'pin' | 'email'>('pin');
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handlePinSubmit = () => {
    setIsLoading(true);
    setError('');
    router.post('/login', { pin }, {
      onFinish: () => setIsLoading(false),
      onError: (errors) => {
        setPin('');
        setError(errors.pin || 'Invalid PIN');
      }
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    router.post('/login', formData, {
      onFinish: () => setIsLoading(false),
      onError: (errors) => setError(errors.email || 'Login failed')
    });
  };

  const handleNumPad = (num: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      // Auto submit on 4th digit? Optional. Let's keep manual or auto.
      // Better to check length in effect if we want auto.
      // For now manual submit or effect.
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  // Keyboard support for PIN entry
  React.useEffect(() => {
    if (mode !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumPad(parseInt(e.key));
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        // Wait for state update is tricky in event listener without refs or dependency
        // But handlePinSubmit uses current state if we pass it, OR we trigger it if length is sufficient.
        // Actually, simply calling handlePinSubmit here might use stale state if not careful.
        // A better approach is to let the user press Enter or rely on auto-submit refs.
        // For simplicity, let's allow Enter to trigger submit logic if we use a ref for 'pin' or just let the button handle it.
        // Wait... handlePinSubmit reads 'pin' from closure. It will be stale in this effect unless 'pin' is in dependency array.
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, pin]); // Added 'pin' dependency so closure has fresh value

  // Handle Enter separately or robustly
  React.useEffect(() => {
    if (mode !== 'pin') return;
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && pin.length >= 4 && !isLoading) {
        // We can't easily call handlePinSubmit because of closure scope issues if defined outside or cyclic deps.
        // Actually, since this effect depends on [pin], handlePinSubmit in scope is fine IF handlePinSubmit is stable or we ignore its changes.
        // Let's keep it simple: Just bind Enter to the button click programmatically or replicate logic.
        // Replicating logic is cleaner here.
        setIsLoading(true);
        setError('');
        router.post('/login', { pin }, {
          onFinish: () => setIsLoading(false),
          onError: (errors) => {
            setPin('');
            setError(errors.pin || 'Invalid PIN');
          }
        });
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [mode, pin, isLoading]);

  return (
    <div className="w-full max-w-[400px] mx-auto p-6">
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm">
          {mode === 'pin' ? 'Enter your 4-digit PIN' : 'Enter your email credentials'}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex bg-white/5 p-1 rounded-xl mb-8">
        <button
          onClick={() => setMode('pin')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'pin' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          PIN Access
        </button>
        <button
          onClick={() => setMode('email')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'email' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Email Login
        </button>
      </div>

      {mode === 'pin' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* PIN Display */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-[#FF6B00] scale-110' : 'bg-white/10'}`} />
            ))}
          </div>
          {error && <p className="text-red-500 text-center text-sm font-bold animate-pulse">{error}</p>}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumPad(num)}
                className="h-16 rounded-xl bg-white/5 hover:bg-white/10 text-2xl font-bold text-white transition-all active:scale-95 border border-white/5"
              >
                {num}
              </button>
            ))}
            <div className="opacity-0"></div>
            <button
              onClick={() => handleNumPad(0)}
              className="h-16 rounded-xl bg-white/5 hover:bg-white/10 text-2xl font-bold text-white transition-all active:scale-95 border border-white/5"
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 flex items-center justify-center border border-red-500/20"
            >
              <Delete size={24} />
            </button>
          </div>

          <button
            onClick={handlePinSubmit}
            disabled={pin.length < 4 || isLoading}
            className="w-full py-4 rounded-xl bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'ENTER'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleEmailSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {error && <p className="text-red-500 text-center text-sm font-bold bg-red-500/10 p-2 rounded">{error}</p>}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#FF6B00]" />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all outline-none"
                placeholder="admin@resto.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-[#FF6B00]" />
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#ff8533] text-white font-bold transition-all shadow-lg flex justify-center items-center">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      )}
    </div>
  );
}