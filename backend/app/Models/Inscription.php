<?php

// app/Models/Inscription.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = ['dateInscription', 'prix', 'progression', 'cours_id', 'etudiant_id'];

    protected $casts = [
        'dateInscription' => 'datetime',
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}
