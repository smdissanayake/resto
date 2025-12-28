import React from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    TrendingUp,
    ShoppingBag,
    DollarSign,
    CreditCard,
    Download
} from 'lucide-react';
import { HourlySalesChart } from '../../components/HourlySalesChart';
import { PaymentTypesChart } from '../../components/PaymentTypesChart';
import { TopDishesWidget } from '../../components/TopDishesWidget';

interface ReportProps {
    filters: {
        range: string;
    };
    summary: {
        revenue: number;
        orders: number;
        avg_value: number;
    };
    charts: {
        hourly: { hour: string; sales: number }[];
        payment_methods: { payment_method: string; total: number }[];
        top_products: { product_name: string; quantity: number; revenue: number }[];
        by_category: { category: string; value: number }[];
    };
    settings?: Record<string, string>; // Add settings prop
}

const COLORS = ['#FF6B00', '#00C853', '#2979FF', '#FFD600', '#AA00FF'];

export default function ReportsIndex({ filters, summary, charts }: ReportProps) {
    const { settings } = usePage().props as any;
    const currencySymbol = (settings as Record<string, string>)?.currency_symbol || '$';
    // Access global settings via usePage
    const { props } = usePage();
    // We already destructured settings above, but ensuring usePage is used correctly.

    const handleRangeChange = (range: string) => {
        router.get('/reports', { range }, { preserveState: true, preserveScroll: true });
    };

    // Transform Data for Charts
    const paymentData = charts.payment_methods.map((item, index) => ({
        name: item.payment_method.toUpperCase(),
        value: Number(item.total),
        color: item.payment_method === 'cash' ? '#00C853' : '#2979FF' // Simple color logic
    }));

    const topDishesData = charts.top_products.map((item, index) => ({
        id: index.toString(),
        name: item.product_name,
        count: Number(item.quantity),
        revenue: Number(item.revenue)
    }));

    // Format Currency
    const formatCurrency = (amount: number) => {
        return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <MainLayout>
            <Head title="Reports & Analytics" />

            <div className="flex flex-col h-[calc(100vh-100px)]">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
                        <p className="text-white/40 text-sm mt-1">
                            Track your restaurant's performance for
                            <span className="text-[#FF6B00] font-bold ml-1 capitalize">{filters.range}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg p-1">
                            {['today', 'week', 'month', 'year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => handleRangeChange(range)}
                                    className={`
                      px-4 py-2 rounded-md text-xs font-bold uppercase transition-all duration-200
                      ${filters.range === range
                                            ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'}
                    `}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        <button disabled className="bg-[#1A1A1A] border border-white/10 p-2.5 rounded-lg text-white/40 cursor-not-allowed opacity-50" title="Export PDF (Coming Soon)">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <SummaryCard
                        title="Total Revenue"
                        value={formatCurrency(summary.revenue)}
                        icon={DollarSign}
                        color="text-[#FF6B00]"
                        bg="bg-[#FF6B00]/10"
                    />
                    <SummaryCard
                        title="Total Orders"
                        value={summary.orders.toString()}
                        icon={ShoppingBag}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />
                    <SummaryCard
                        title="Avg. Order Value"
                        value={formatCurrency(summary.avg_value)}
                        icon={TrendingUp}
                        color="text-green-400"
                        bg="bg-green-500/10"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pb-4">
                    {/* Hourly Trend (Wide) */}
                    <div className="lg:col-span-2 min-h-[300px]">
                        <HourlySalesChart data={charts.hourly.map(h => ({ ...h, sales: Number(h.sales) }))} />
                    </div>

                    {/* Payment Methods */}
                    <div className="min-h-[300px]">
                        <PaymentTypesChart data={paymentData} />
                    </div>

                    {/* Top 5 Items */}
                    <div className="min-h-[300px]">
                        <TopDishesWidget data={topDishesData} />
                    </div>

                    {/* Category Performance (Custom Widget) */}
                    <div className="lg:col-span-2 bg-[#1E1E1E] border border-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-4">Category Performance</h3>
                        <div className="space-y-4">
                            {charts.by_category.map((cat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs text-white mb-1">
                                        <span>{cat.category}</span>
                                        <span>{formatCurrency(Number(cat.value))}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(Number(cat.value) / summary.revenue) * 100}%`,
                                                backgroundColor: COLORS[idx % COLORS.length]
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {charts.by_category.length === 0 && <p className="text-xs text-white/20">No data available</p>}
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}

// Sub-component for Cards
function SummaryCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-5 flex items-center justify-between shadow-lg">
            <div>
                <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
                <h2 className="text-2xl font-bold text-white tracking-tight">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}
