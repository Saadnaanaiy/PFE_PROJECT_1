<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $fillable = ['user_id', 'photo'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function cours()
    {
        return $this->belongsToMany(Cours::class, 'inscriptions');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }
}
