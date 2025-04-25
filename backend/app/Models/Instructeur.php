<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instructeur extends Model
{
    protected $fillable = ['user_id', 'bio', 'specialite'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }
}
