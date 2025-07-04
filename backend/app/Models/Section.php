<?php
// app/Models/Section.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'ordre',
        'cours_id'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function lecons()
    {
        return $this->hasMany(Lecon::class);
    }
}