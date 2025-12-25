import React, { useState } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { 
  RefreshCw, 
  Calendar, 
  LayoutDashboard, 
  Store, 
  FileText, 
  ShoppingBag, 
  Settings,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { HourlySalesChart } from '../components/HourlySalesChart';
import { PaymentTypesChart } from '../components/PaymentTypesChart';
import { TopDishesWidget } from '../components/TopDishesWidget';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { StaffPerformanceWidget } from '../components/StaffPerformanceWidget';
import { TableTurnoverWidget } from '../components/TableTurnoverWidget';
import { Link } from '@inertiajs/react';

// Mock Data (Preserved)
const KPI_DATA = {
  sales: { value: '$2,450', change: 5.2, trend: 'up' as const, data: [{ value: 1200 }, { value: 1900 }, { value: 1500 }, { value: 2100 }, { value: 2450 }] },
  orders: { value: '87', change: 12, trend: 'up' as const, data: [{ value: 40 }, { value: 65 }, { value: 55 }, { value: 78 }, { value: 87 }] },
  avgOrder: { value: '$28.16', change: -2.1, trend: 'down' as const, data: [{ value: 32 }, { value: 30 }, { value: 29 }, { value: 28.5 }, { value: 28.16 }] },
  customers: { value: '156', change: 8, trend: 'up' as const, data: [{ value: 100 }, { value: 130 }, { value: 120 }, { value: 145 }, { value: 156 }] }
};

const HOURLY_DATA = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, sales: Math.floor(Math.random() * 500) + 50 }));

const PAYMENT_DATA = [
  { name: 'Cash', value: 40, color: '#FF6B00' },
  { name: 'Card', value: 35, color: '#3B82F6' },
  { name: 'QR', value: 15, color: '#10B981' },
  { name: 'Delivery', value: 10, color: '#8B5CF6' }
];

const TOP_DISHES = [
  { id: '1', name: 'Classic Smash Burger', count: 45, revenue: 584.55 },
  { id: '2', name: 'Pepperoni Feast Pizza', count: 32, revenue: 543.68 },
  { id: '3', name: 'Caesar Salad', count: 28, revenue: 307.72 },
  { id: '4', name: 'Craft Cola', count: 85, revenue: 254.15 },
  { id: '5', name: 'Chocolate Lava Cake', count: 22, revenue: 175.78 }
];

const ACTIVITIES = [
  { id: '1', type: 'order' as const, text: 'Order #1234 completed', time: '2m ago' },
  { id: '2', type: 'table' as const, text: 'Table 5 seated (4 guests)', time: '5m ago' },
  { id: '3', type: 'payment' as const, text: 'Payment received $45.50', time: '8m ago' },
  { id: '4', type: 'alert' as const, text: 'Low stock alert: Tomatoes', time: '15m ago' },
  { id: '5', type: 'order' as const, text: 'New order #1235 received', time: '18m ago' },
  { id: '6', type: 'table' as const, text: 'Table 3 cleared', time: '22m ago' },
  { id: '7', type: 'payment' as const, text: 'Payment received $128.00', time: '25m ago' }
];

const STAFF_DATA = [
  { id: '1', name: 'Sarah J.', orders: 24, revenue: 850, performance: 95 },
  { id: '2', name: 'Mike R.', orders: 18, revenue: 620, performance: 82 },
  { id: '3', name: 'Alex L.', orders: 15, revenue: 480, performance: 70 },
  { id: '4', name: 'Jordan P.', orders: 12, revenue: 390, performance: 65 }
];

const TABLE_METRICS = { avgTurnover: '45 min', tablesServed: 32, occupancy: 75 };

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('Today');
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'pos', label: 'POS Screen', icon: Store, href: '/pos' },
    { id: 'reports', label: 'Reports', icon: FileText, href: '#' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '#' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '#' },
  ];

  return (
    <MainLayout>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg p-1">
              {['Today', 'Week', 'Month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                    ${dateRange === range 
                      ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI Cards Row */}
          <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300">
            <KPICard title="Daily Sales" value={KPI_DATA.sales.value} change={KPI_DATA.sales.change} trend={KPI_DATA.sales.trend} data={KPI_DATA.sales.data} />
          </div>
          <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[50ms]">
            <KPICard title="Total Orders" value={KPI_DATA.orders.value} change={KPI_DATA.orders.change} trend={KPI_DATA.orders.trend} data={KPI_DATA.orders.data} />
          </div>
          <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[100ms]">
            <KPICard title="Avg Order Value" value={KPI_DATA.avgOrder.value} change={KPI_DATA.avgOrder.change} trend={KPI_DATA.avgOrder.trend} data={KPI_DATA.avgOrder.data} />
          </div>
          <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[150ms]">
            <KPICard title="Customer Count" value={KPI_DATA.customers.value} change={KPI_DATA.customers.change} trend={KPI_DATA.customers.trend} data={KPI_DATA.customers.data} />
          </div>

          {/* Charts Row */}
          <div className="col-span-1 md:col-span-2 h-[300px] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-shadow duration-500 rounded-xl">
            <HourlySalesChart data={HOURLY_DATA} />
          </div>
          <div className="col-span-1 h-[300px]">
             <PaymentTypesChart data={PAYMENT_DATA} />
          </div>
          <div className="col-span-1 h-[300px]">
            <TopDishesWidget data={TOP_DISHES} />
          </div>

          {/* Bottom Row */}
          <div className="col-span-1 md:col-span-2 h-[300px]">
            <RecentActivityFeed data={ACTIVITIES} />
          </div>
          <div className="col-span-1 h-[300px]">
            <StaffPerformanceWidget data={STAFF_DATA} />
          </div>
          <div className="col-span-1 h-[300px]">
            <TableTurnoverWidget data={TABLE_METRICS} />
          </div>
        </div>
    </MainLayout>
  );
}