<?php

// app/Models/Discussion.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    protected $fillable = ['sujet', 'dateCreation', 'forum_id', 'etudiant_id'];

    protected $casts = [
        'dateCreation' => 'datetime',
    ];

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
