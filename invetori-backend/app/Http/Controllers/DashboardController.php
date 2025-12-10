<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\IncomingItem;
use App\Models\OutgoingItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Total products
        $totalProducts = Product::count();

        // Total stock value
        $totalStockValue = Product::sum(DB::raw('stock * purchase_price'));

        // Low stock products (stock < 10)
        $lowStockProducts = Product::where('stock', '<', 10)->count();

        // Today's transactions
        $today = now()->toDateString();
        $todayIncoming = IncomingItem::whereDate('date', $today)->sum('quantity');
        $todayOutgoing = OutgoingItem::whereDate('date', $today)->sum('quantity');

        // This month's transactions
        $thisMonth = now()->format('Y-m');
        $monthlyIncoming = IncomingItem::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('quantity');
        $monthlyOutgoing = OutgoingItem::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$thisMonth])->sum('quantity');

        // Recent transactions (last 5)
        $recentIncoming = IncomingItem::with('product')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        $recentOutgoing = OutgoingItem::with('product')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Top products by stock
        $topProducts = Product::orderBy('stock', 'desc')->limit(5)->get();

        // Monthly trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');
            $monthName = now()->subMonths($i)->format('M Y');
            
            $incoming = IncomingItem::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])->sum('quantity');
            $outgoing = OutgoingItem::whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$month])->sum('quantity');
            
            $monthlyTrend[] = [
                'month' => $monthName,
                'incoming' => $incoming,
                'outgoing' => $outgoing,
            ];
        }

        return response()->json([
            'summary' => [
                'total_products' => $totalProducts,
                'total_stock_value' => $totalStockValue,
                'low_stock_products' => $lowStockProducts,
                'today_incoming' => $todayIncoming,
                'today_outgoing' => $todayOutgoing,
                'monthly_incoming' => $monthlyIncoming,
                'monthly_outgoing' => $monthlyOutgoing,
            ],
            'recent_incoming' => $recentIncoming,
            'recent_outgoing' => $recentOutgoing,
            'top_products' => $topProducts,
            'monthly_trend' => $monthlyTrend,
        ]);
    }
}
