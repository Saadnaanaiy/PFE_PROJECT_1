<?php

// app/Models/Message.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['contenu', 'dateEnvoi', 'discussion_id', 'user_id'];

    protected $casts = [
        'dateEnvoi' => 'datetime',
    ];

    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

