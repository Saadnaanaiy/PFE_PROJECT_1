<?php

// app/Models/Ressource.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ressource extends Model
{
    protected $fillable = ['titre', 'fichier', 'cours_id'];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
}
