<?php

// app/Models/PanierItem.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanierItem extends Model
{
    protected $fillable = ['panier_id', 'cours_id'];

    public function panier()
    {
        return $this->belongsTo(Panier::class);
    }

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
}
