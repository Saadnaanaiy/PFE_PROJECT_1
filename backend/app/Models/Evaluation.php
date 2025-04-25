<?php

// app/Models/Evaluation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = ['note', 'commentaire', 'dateEvaluation', 'cours_id', 'etudiant_id'];

    protected $casts = [
        'dateEvaluation' => 'datetime',
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

