<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutgoingItem extends Model
{
    protected $fillable = [
        'product_id',
        'date',
        'quantity',
        'recipient',
        'notes'
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
