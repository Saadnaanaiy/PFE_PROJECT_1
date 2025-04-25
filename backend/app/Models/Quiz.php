<?php

// app/Models/Quiz.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['titre', 'nbQuestions', 'lecon_id'];

    public function lecon()
    {
        return $this->belongsTo(Lecon::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
