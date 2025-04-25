<?php

// app/Models/Panier.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    protected $fillable = ['user_id', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(PanierItem::class);
    }

    public function cours()
    {
        return $this->belongsToMany(Cours::class, 'panier_items');
    }

    // Calculate total price of all items in cart
    public function getTotalAttribute()
    {
        return $this->cours->sum('prix');
    }
}
