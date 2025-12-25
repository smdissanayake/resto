import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  Store, 
  FileText, 
  ShoppingBag, 
  Settings,
  Bell,
  Search,
  Package,
  Users,
  ChefHat,
  Grid
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { url } = usePage();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'pos', label: 'POS', icon: Store, href: '/pos' }, // Keeping as link
    { id: 'inventory', label: 'Inventory', icon: Package, href: '/inventory' },
    { id: 'tables', label: 'Tables', icon: Grid, href: '/tables' },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, href: '/kitchen' },
    { id: 'staff', label: 'Staff', icon: Users, href: '/staff' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-y-auto font-sans">
      {/* Premium Top Navigation Bar */}
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0 min-w-[140px]">
              <div className="h-9 w-9 bg-gradient-to-tr from-[#FF6B00] to-[#ff9f4d] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight hidden md:block">
                Resto<span className="text-[#FF6B00]">SaaS</span>
              </span>
            </div>

            {/* Centered Navigation Tabs - Scrollable on mobile */}
            <div className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar mask-gradient-x">
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.href) && item.href !== '#' && (item.href === '/dashboard' ? url === '/dashboard' : true);
                    return (
                        <Link
                        key={item.id}
                        href={item.href}
                        className={`
                            relative flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            whitespace-nowrap
                            ${isActive 
                            ? 'text-white bg-[#white]/10 shadow-[0_0_20px_rgba(255,107,0,0.15)] bg-gradient-to-r from-[#FF6B00]/10 to-[#FF6B00]/5 border border-[#FF6B00]/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                        >
                        <item.icon size={16} className={isActive ? 'text-[#FF6B00]' : ''} />
                        <span className="hidden sm:inline">{item.label}</span>
                        {isActive && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6B00] -mb-1.5 opacity-0 md:opacity-100" />
                        )}
                        </Link>
                    );
                })}
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0 min-w-[140px] justify-end">
              {/* Search */}
              <div className="hidden xl:flex items-center bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 w-64 focus-within:border-[#FF6B00]/50 transition-colors">
                <Search size={14} className="text-white/40 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-white/30"
                />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg border border-white/5">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-[#1A1A1A]" />
              </button>
              
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#FF6B00]/50 transition-colors">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1920px] mx-auto px-4 lg:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
