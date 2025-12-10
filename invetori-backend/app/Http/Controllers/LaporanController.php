<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\IncomingItem;
use App\Models\OutgoingItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    // Stock Report
    public function stock(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('low_stock') && $request->low_stock) {
            $query->where('stock', '<', 10);
        }

        $products = $query->orderBy('name')->get();

        return response()->json([
            'title' => 'Laporan Stok Barang',
            'generated_at' => now()->toDateTimeString(),
            'data' => $products,
            'summary' => [
                'total_items' => $products->count(),
                'total_stock' => $products->sum('stock'),
                'total_value' => $products->sum(function($p) {
                    return $p->stock * $p->purchase_price;
                }),
            ]
        ]);
    }

    // Incoming Items Report
    public function incoming(Request $request)
    {
        $query = IncomingItem::with('product');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        } else {
            // Default: current month
            $query->whereMonth('date', now()->month)
                  ->whereYear('date', now()->year);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $items = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'title' => 'Laporan Barang Masuk',
            'period' => [
                'start' => $request->start_date ?? now()->startOfMonth()->toDateString(),
                'end' => $request->end_date ?? now()->endOfMonth()->toDateString(),
            ],
            'generated_at' => now()->toDateTimeString(),
            'data' => $items,
            'summary' => [
                'total_transactions' => $items->count(),
                'total_quantity' => $items->sum('quantity'),
                'by_product' => $items->groupBy('product_id')->map(function($group) {
                    return [
                        'product_name' => $group->first()->product->name,
                        'total_quantity' => $group->sum('quantity'),
                        'transactions' => $group->count(),
                    ];
                })->values(),
            ]
        ]);
    }

    // Outgoing Items Report
    public function outgoing(Request $request)
    {
        $query = OutgoingItem::with('product');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        } else {
            // Default: current month
            $query->whereMonth('date', now()->month)
                  ->whereYear('date', now()->year);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $items = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'title' => 'Laporan Barang Keluar',
            'period' => [
                'start' => $request->start_date ?? now()->startOfMonth()->toDateString(),
                'end' => $request->end_date ?? now()->endOfMonth()->toDateString(),
            ],
            'generated_at' => now()->toDateTimeString(),
            'data' => $items,
            'summary' => [
                'total_transactions' => $items->count(),
                'total_quantity' => $items->sum('quantity'),
                'by_product' => $items->groupBy('product_id')->map(function($group) {
                    return [
                        'product_name' => $group->first()->product->name,
                        'total_quantity' => $group->sum('quantity'),
                        'transactions' => $group->count(),
                    ];
                })->values(),
            ]
        ]);
    }

    // Transaction Summary Report
    public function summary(Request $request)
    {
        $startDate = $request->start_date ?? now()->startOfMonth()->toDateString();
        $endDate = $request->end_date ?? now()->endOfMonth()->toDateString();

        $incoming = IncomingItem::with('product')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $outgoing = OutgoingItem::with('product')
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $products = Product::all();

        $summary = $products->map(function($product) use ($incoming, $outgoing) {
            $inQty = $incoming->where('product_id', $product->id)->sum('quantity');
            $outQty = $outgoing->where('product_id', $product->id)->sum('quantity');

            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_code' => $product->code,
                'current_stock' => $product->stock,
                'incoming_qty' => $inQty,
                'outgoing_qty' => $outQty,
                'net_change' => $inQty - $outQty,
            ];
        });

        return response()->json([
            'title' => 'Laporan Ringkasan Transaksi',
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'generated_at' => now()->toDateTimeString(),
            'data' => $summary,
            'grand_total' => [
                'total_incoming' => $incoming->sum('quantity'),
                'total_outgoing' => $outgoing->sum('quantity'),
                'net_change' => $incoming->sum('quantity') - $outgoing->sum('quantity'),
            ]
        ]);
    }
}
