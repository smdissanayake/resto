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
import { Link, router } from '@inertiajs/react';

// Interfaces for Props
interface Stats {
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  data?: { value: number }[]; // Optional sparkline data
}

interface DashboardProps {
  stats: {
    sales: Stats;
    orders: Stats;
    avgOrder: Stats;
    customers: Stats;
  };
  hourlyData: { hour: string; sales: number }[];
  paymentData: { name: string; value: number; color: string }[];
  topDishes: { id: string; name: string; count: number; revenue: number }[];
  staffPerformance: { id: string; name: string; orders: number; revenue: number; performance: number }[];
  tableMetrics: { avgTurnover: string; tablesServed: number; occupancy: number };
}

export default function AnalyticsDashboard({ stats, hourlyData, paymentData, topDishes, recentActivity, staffPerformance, tableMetrics }: DashboardProps) {
  const [dateRange, setDateRange] = useState('Today');

  // Auto-Refresh every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Use router.visit to refresh content without full page reload
      // preserveScroll: true keeps the user's scroll position
      // preserveState: true keeps local state like selected tabs (if any)
      // only: [...] could be used to fetch specific props, but we want generally fresh data
      router.reload({ preserveScroll: true, preserveState: true });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs text-white/40 mr-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            Live Updates (30s)
          </div>

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
          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1A1A1A] border border-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards Row */}
        <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300">
          <KPICard title="Daily Sales" value={stats.sales.value} change={stats.sales.change} trend={stats.sales.trend} data={stats.sales.data} />
        </div>
        <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[50ms]">
          <KPICard title="Total Orders" value={stats.orders.value} change={stats.orders.change} trend={stats.orders.trend} data={stats.orders.data} />
        </div>
        <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[100ms]">
          <KPICard title="Avg Order Value" value={stats.avgOrder.value} change={stats.avgOrder.change} trend={stats.avgOrder.trend} data={stats.avgOrder.data} />
        </div>
        <div className="h-[120px] transition-transform hover:-translate-y-1 duration-300 delay-[150ms]">
          <KPICard title="Occupancy" value={tableMetrics ? tableMetrics.occupancy.toString() : '0'} change={0} trend="neutral" />
        </div>

        {/* Charts Row */}
        <div className="col-span-1 md:col-span-2 h-[300px] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-shadow duration-500 rounded-xl">
          <HourlySalesChart data={hourlyData} />
        </div>
        <div className="col-span-1 h-[300px]">
          <PaymentTypesChart data={paymentData} />
        </div>
        <div className="col-span-1 h-[300px]">
          <TopDishesWidget data={topDishes} />
        </div>

        {/* Bottom Row */}
        <div className="col-span-1 md:col-span-2 h-[300px]">
          <RecentActivityFeed data={recentActivity} />
        </div>
        <div className="col-span-1 h-[300px]">
          <StaffPerformanceWidget data={staffPerformance} />
        </div>
        <div className="col-span-1 h-[300px]">
          <TableTurnoverWidget data={tableMetrics} />
        </div>
      </div>
    </MainLayout>
  );
}