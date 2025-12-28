import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react'; // Added router
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
  Grid,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { url, props } = usePage();
  const user = props.auth.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Define authorized roles for each menu item
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'manager'] },
    { id: 'pos', label: 'POS', icon: Store, href: '/pos', roles: ['admin', 'manager', 'cashier', 'waiter'] },
    { id: 'menu', label: 'Menu', icon: ChefHat, href: '/products', roles: ['admin', 'manager'] },
    { id: 'inventory', label: 'Inventory', icon: Package, href: '/inventory', roles: ['admin', 'manager'] },
    { id: 'tables', label: 'Tables', icon: Grid, href: '/tables', roles: ['admin', 'manager', 'cashier', 'waiter'] },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, href: '/kitchen', roles: ['admin', 'manager', 'kitchen_staff'] },
    { id: 'staff', label: 'Staff', icon: Users, href: '/staff', roles: ['admin', 'manager'] },
    { id: 'reports', label: 'Reports', icon: FileText, href: '/reports', roles: ['admin', 'manager'] },
  ];

  // Filter items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  // Read global settings
  const settings = (props.settings as Record<string, string>) || {};
  const restaurantName = settings.restaurant_name || 'RestoSaaS';
  const logoPath = settings.logo_path || null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-y-auto font-sans print:bg-white print:overflow-visible">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#1A1A1A] border-r border-white/10 z-50 flex flex-col lg:hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {logoPath ? (
                    <img src={logoPath} alt="Logo" className="h-8 w-8 rounded-lg object-cover shadow-lg shadow-[#FF6B00]/20" />
                  ) : (
                    <div className="h-8 w-8 bg-gradient-to-tr from-[#FF6B00] to-[#ff9f4d] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
                      <span className="text-white font-bold">R</span>
                    </div>
                  )}
                  <span className="text-white font-bold text-lg tracking-tight">
                    {restaurantName}
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = url.startsWith(item.href) && item.href !== '#' && (item.href === '/dashboard' ? url === '/dashboard' : true);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive
                          ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium">
                  <LogOut size={20} />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Top Navigation Bar */}
      <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 print:hidden">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Left Side: Menu Toggle + Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2">
                {logoPath ? (
                  <img src={logoPath} alt="Logo" className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-[#FF6B00]/20" />
                ) : (
                  <div className="h-9 w-9 bg-gradient-to-tr from-[#FF6B00] to-[#ff9f4d] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                )}
                <span className="text-white font-bold text-lg tracking-tight hidden md:block">
                  {restaurantName}
                </span>
                {/* Mobile text logo if needed, or keep hidden */}
                <span className="text-white font-bold text-lg tracking-tight md:hidden">
                  Resto
                </span>
              </div>
            </div>

            {/* Centered Navigation Tabs - Desktop Only */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                {navItems.map((item) => {
                  const isActive = url.startsWith(item.href) && item.href !== '#' && (item.href === '/dashboard' ? url === '/dashboard' : true);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={item.label}
                      className={`
                            relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                            whitespace-nowrap
                            ${isActive
                          ? 'text-white bg-[#white]/10 shadow-[0_0_20px_rgba(255,107,0,0.15)] bg-gradient-to-r from-[#FF6B00]/10 to-[#FF6B00]/5 border border-[#FF6B00]/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                      <item.icon size={20} className={isActive ? 'text-[#FF6B00]' : ''} />
                      <span className="hidden xl:inline">{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF6B00] -mb-1.5 opacity-0 md:opacity-100" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 justify-end">
              {/* Search - Mobile hidden or simplified */}
              <div className="hidden xl:flex items-center bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 w-64 focus-within:border-[#FF6B00]/50 transition-colors">
                <Search size={14} className="text-white/40 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-white/30"
                />
              </div>

              {/* Mobile Search Icon Only */}
              <button className="xl:hidden p-2 text-white/40 hover:text-white">
                <Search size={20} />
              </button>

              <button className="relative p-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg border border-white/5">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-[#1A1A1A]" />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="h-9 w-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#FF6B00]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50"
                >
                  <span className="text-xs font-bold text-white">
                    {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
                      </div>
                      <div className="p-1">


                        {(user.role === 'admin' || user.role === 'manager') && (
                          <Link
                            href="/settings"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </Link>
                        )}
                        <button
                          onClick={() => router.post('/logout')}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left mt-1"
                        >
                          <LogOut size={16} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
