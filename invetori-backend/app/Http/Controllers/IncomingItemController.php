<?php

namespace App\Http\Controllers;

use App\Models\IncomingItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class IncomingItemController extends Controller
{
    // GET /api/incoming-items
    public function index(Request $request)
    {
        $query = IncomingItem::with('product');

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('supplier', 'like', "%{$search}%")
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

    // GET /api/incoming-items/{id}
    public function show($id)
    {
        $item = IncomingItem::with('product')->find($id);

        if (!$item) {
            return response()->json(['message' => 'Incoming item not found'], 404);
        }

        return response()->json($item);
    }

    // POST /api/incoming-items
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'date' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'supplier' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $item = IncomingItem::create($request->all());
            $product = Product::find($request->product_id);
            $product->increment('stock', $request->quantity);

            DB::commit();

            return response()->json([
                'message' => 'Incoming item created successfully',
                'data' => $item->load('product')
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to create incoming item'], 500);
        }
    }

    // PUT /api/incoming-items/{id}
    public function update(Request $request, $id)
    {
        $item = IncomingItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Incoming item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'sometimes|exists:products,id',
            'date' => 'sometimes|date',
            'quantity' => 'sometimes|integer|min:1',
            'supplier' => 'nullable|string|max:255',
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
                $oldProduct->decrement('stock', $oldQuantity);

                $newProduct = Product::find($item->product_id);
                $newProduct->increment('stock', $item->quantity);
            }

            DB::commit();

            return response()->json([
                'message' => 'Incoming item updated successfully',
                'data' => $item->load('product')
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to update incoming item'], 500);
        }
    }

    // DELETE /api/incoming-items/{id}
    public function destroy($id)
    {
        $item = IncomingItem::find($id);

        if (!$item) {
            return response()->json(['message' => 'Incoming item not found'], 404);
        }

        DB::beginTransaction();
        try {
            $product = Product::find($item->product_id);
            $product->decrement('stock', $item->quantity);
            $item->delete();

            DB::commit();

            return response()->json([
                'message' => 'Incoming item deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Failed to delete incoming item'], 500);
        }
    }
}
