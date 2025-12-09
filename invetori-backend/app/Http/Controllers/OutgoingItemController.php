<?php

namespace App\Http\Controllers;

use App\Models\OutgoingItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OutgoingItemController extends Controller
{
    // GET /api/outgoing-items
    public function index(Request $request)
    {
        $query = OutgoingItem::with('product');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('recipient', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhereHas('product', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 10);
        $items = $query->orderBy('date', 'desc')->paginate($perPage);

        return response()->json($items);
    }

    // GET /api/outgoing-items/{id}
    public function show($id)
    {
        $item = OutgoingItem::with('product')->find($id);

        if (!$item) {
            return response()->json(['message' => 'Outgoing item not found'], 404);
        }

        return response()->json($item);
    }

    // POST /api/outgoing-items
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'recipient' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $product = Product::find($request->product_id);
            
            // Check stock availability
            if ($product->stock < $request->quantity) {
                return response()->json([
                    'message' => 'Insufficient stock',
                    'available_stock' => $product->stock
                ], 400);
            }

            $item = OutgoingItem::create($request->all());
            $product->decrement('stock', $request->quantity);

            DB::commit();

            return response()->json([
                'message' => 'Outgoing item created successfully',
                'data' => $item->load('product')
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to create outgoing item'], 500);
        }
    }

    // PUT /api/outgoing-items/{id}
    public function update(Request $request, $id)
    {
        $item = OutgoingItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Outgoing item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'sometimes|exists:products,id',
            'date' => 'sometimes|date',
            'quantity' => 'sometimes|integer|min:1',
            'recipient' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $oldQuantity = $item->quantity;
            $oldProductId = $item->product_id;

            $item->update($request->all());

            if ($request->has('quantity') || $request->has('product_id')) {
                $oldProduct = Product::find($oldProductId);
                $oldProduct->increment('stock', $oldQuantity);

                $newProduct = Product::find($item->product_id);
                
                if ($newProduct->stock < $item->quantity) {
                    DB::rollback();
                    return response()->json([
                        'message' => 'Insufficient stock',
                        'available_stock' => $newProduct->stock
                    ], 400);
                }

                $newProduct->decrement('stock', $item->quantity);
            }

            DB::commit();

            return response()->json([
                'message' => 'Outgoing item updated successfully',
                'data' => $item->load('product')
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to update outgoing item'], 500);
        }
    }

    // DELETE /api/outgoing-items/{id}
    public function destroy($id)
    {
        $item = OutgoingItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Outgoing item not found'], 404);
        }

        DB::beginTransaction();
        try {
            $product = Product::find($item->product_id);
            $product->increment('stock', $item->quantity);
            $item->delete();

            DB::commit();

            return response()->json([
                'message' => 'Outgoing item deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to delete outgoing item'], 500);
        }
    }
}
