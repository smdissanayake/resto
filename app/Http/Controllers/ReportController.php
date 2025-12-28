<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Default to 'today' if no range provided
        $range = $request->input('range', 'today');
        $startDate = Carbon::today();
        $endDate = Carbon::now()->endOfDay();

        if ($range === 'week') {
            $startDate = Carbon::now()->startOfWeek();
        } elseif ($range === 'month') {
            $startDate = Carbon::now()->startOfMonth();
        } elseif ($range === 'year') {
            $startDate = Carbon::now()->startOfYear();
        }

        // Base Query: Paid Orders only
        $ordersQuery = Order::where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate]);

        // 1. Summary Cards
        $totalRevenue = $ordersQuery->sum('total_amount');
        $totalOrders = $ordersQuery->count();
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        
        // 2. Sales by Payment Method
        $salesByMethod = $ordersQuery->clone()
            ->select('payment_method', DB::raw('sum(total_amount) as total'))
            ->groupBy('payment_method')
            ->get();

        // 3. Hourly Sales Trend (for chart)
        $hourlySales = $ordersQuery->clone()
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%H:00") as hour'),
                DB::raw('sum(total_amount) as sales'),
                DB::raw('count(*) as orders')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // 4. Top Selling Products
        // Need to join order_items -> orders to check date range
        $topProducts = OrderItem::select(
                'product_name', 
                DB::raw('sum(quantity) as quantity'),
                DB::raw('sum(quantity * unit_price) as revenue')
            )
            ->whereHas('order', function($q) use ($startDate, $endDate) {
                $q->where('payment_status', 'paid')
                  ->where('status', '!=', 'cancelled')
                  ->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->groupBy('product_name')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get();

        // 5. Sales by Category (Simple Group By)
        $salesByCategory = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.payment_status', 'paid')
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select('products.category as category', DB::raw('sum(order_items.quantity * order_items.unit_price) as value'))
            ->groupBy('products.category')
            ->get();


        return Inertia::render('Reports/Index', [
            'filters' => [
                'range' => $range,
            ],
            'summary' => [
                'revenue' => $totalRevenue,
                'orders' => $totalOrders,
                'avg_value' => $averageOrderValue,
            ],
            'charts' => [
                'hourly' => $hourlySales,
                'payment_methods' => $salesByMethod,
                'top_products' => $topProducts,
                'by_category' => $salesByCategory
            ]
        ]);
    }
}
