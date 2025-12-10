<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'category',
        'stock',
        'unit',
        'purchase_price',
        'selling_price'
    ];

    protected $casts = [
        'stock' => 'integer',
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];

    public function incomingItems()
    {
        return $this->hasMany(IncomingItem::class);
    }

    public function outgoingItems()
    {
        return $this->hasMany(OutgoingItem::class);
    }
}
