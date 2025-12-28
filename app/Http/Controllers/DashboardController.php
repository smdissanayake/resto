<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Daily Stats (Cards)
        $todaysOrders = Order::whereDate('created_at', $today)->get();
        $totalSales = $todaysOrders->sum('total_amount');
        $orderCount = $todaysOrders->count();
        $avgOrderValue = $orderCount > 0 ? $totalSales / $orderCount : 0;
        
        // TODO: We could calculate 'change' percentage by comparing with yesterday if needed.
        // For now, we'll send raw current values.

        // 2. Hourly Sales (Chart)
        // Group by hour (00-23)
        $hourlySales = Order::whereDate('created_at', $today)
            ->select(DB::raw('HOUR(created_at) as hour'), DB::raw('SUM(total_amount) as sales'))
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('sales', 'hour')
            ->toArray();

        // Format for frontend (Fill missing hours with 0)
        $formattedHourlyData = [];
        for ($i = 0; $i < 24; $i++) {
            $formattedHourlyData[] = [
                'hour' => sprintf('%02d:00', $i),
                'sales' => $hourlySales[$i] ?? 0
            ];
        }

        // 3. Payment Methods (Pie Chart)
        $paymentStats = Order::whereDate('created_at', $today)
            ->select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                // Map to frontend expected format
                $colors = [
                    'Cash' => '#FF6B00',
                    'Card' => '#3B82F6',
                    'QR' => '#10B981', 
                    'Delivery' => '#8B5CF6',
                    'cash' => '#FF6B00', // Handle lowercase
                    'card' => '#3B82F6',
                ];
                $name = ucfirst($item->payment_method);
                return [
                    'name' => $name,
                    'value' => $item->count,
                    'color' => $colors[$item->payment_method] ?? '#999999'
                ];
            });

        // 4. Top Dishes (Table)
        $topDishes = OrderItem::whereDate('created_at', $today)
            ->select('product_name', DB::raw('SUM(quantity) as count'), DB::raw('SUM(quantity * unit_price) as revenue'))
            ->groupBy('product_name')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($item, $index) {
                return [
                    'id' => (string)($index + 1),
                    'name' => $item->product_name,
                    'count' => (int)$item->count,
                    'revenue' => (float)$item->revenue
                ];
            });

        // 5. Recent Activity (Feed)
        $recentOrders = Order::latest()->take(5)->get()->map(function ($order) {
            return [
                'id' => (string)$order->id,
                'type' => 'order',
                'text' => "Order {$order->order_number} - $" . number_format($order->total_amount, 2),
                'time' => $order->created_at->diffForHumans()
            ];
        });

        // 6. Staff Performance (Real Data)
        // Group by user_id and calculate stats
        $topStaff = Order::whereDate('created_at', $today)
            ->whereNotNull('user_id')
            ->select('user_id', DB::raw('COUNT(*) as orders'), DB::raw('SUM(total_amount) as revenue'))
            ->groupBy('user_id')
            ->with('user') // Eager load user
            ->orderByDesc('revenue')
            ->take(5)
            ->get()
            ->map(function ($stat) {
                 // Calculate relative performance (0-100) based on max revenue? 
                 // For now, let's just use a simple mock score or relative to highest
                 return [
                    'id' => (string)$stat->user_id,
                    'name' => $stat->user->name ?? 'Unknown',
                    'orders' => $stat->orders,
                    'revenue' => (float)$stat->revenue,
                    'performance' => 80 // Placeholder or calc relative
                 ];
            });
            
        // Calculate max revenue for performance bar
        $maxRevenue = $topStaff->max('revenue') ?: 1;
        $topStaff = $topStaff->map(function ($staff) use ($maxRevenue) {
            $staff['performance'] = min(100, round(($staff['revenue'] / $maxRevenue) * 100));
            return $staff;
        });

        // 7. Table Metrics (Real Data Estimates)
        $activeTables = \App\Models\DiningTable::where('status', 'occupied')->count();
        $tablesServed = Order::whereDate('created_at', $today)->distinct('dining_table_id')->count('dining_table_id');

        return Inertia::render('AnalyticsDashboard', [
            'stats' => [
                'sales' => ['value' => '$' . number_format($totalSales, 2), 'change' => 0, 'trend' => 'neutral'],
                'orders' => ['value' => (string)$orderCount, 'change' => 0, 'trend' => 'neutral'],
                'avgOrder' => ['value' => '$' . number_format($avgOrderValue, 2), 'change' => 0, 'trend' => 'neutral'],
                'customers' => ['value' => 'N/A', 'change' => 0, 'trend' => 'neutral']
            ],
            'hourlyData' => $formattedHourlyData,
            'paymentData' => $paymentStats,
            'topDishes' => $topDishes,
            'recentActivity' => $recentOrders,
            'staffPerformance' => $topStaff, // New Prop
            'tableMetrics' => [
                'occupancy' => $activeTables,
                'tablesServed' => $tablesServed,
                'avgTurnover' => '45 min' // Still hard to calc without logs
            ]
        ]);
    }
}
