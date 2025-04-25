<?php

// app/Models/Lecon.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecon extends Model
{
    protected $fillable = ['titre', 'ordre', 'estGratuite', 'section_id'];

    protected $casts = [
        'estGratuite' => 'boolean',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function video()
    {
        return $this->hasOne(Video::class);
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
}

