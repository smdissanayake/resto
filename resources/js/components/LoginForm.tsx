import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };
  return <div className="w-full max-w-[400px] mx-auto p-6">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm">
          Enter your credentials to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors duration-300" />
            </div>
            <input id="email" type="email" required value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B00]/50 focus:ring-1 focus:ring-[#FF6B00]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm sm:text-sm" placeholder="chef@restaurant.com" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF6B00] transition-colors duration-300" />
            </div>
            <input id="password" type="password" required value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B00]/50 focus:ring-1 focus:ring-[#FF6B00]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm sm:text-sm" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-[#FF6B00] transition-colors duration-200">
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#ff8533] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </>}
        </button>
      </form>
    </div>;
}