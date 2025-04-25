<?php

// app/Models/Video.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['titre', 'url', 'dureeMinutes', 'lecon_id'];

    public function lecon()
    {
        return $this->belongsTo(Lecon::class);
    }
}

