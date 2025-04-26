<?php
// app/Models/Forum.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'dateCreation',
        'cours_id'
    ];

    protected $casts = [
        'dateCreation' => 'datetime'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }
}