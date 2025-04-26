<?php
// app/Models/Cours.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'prix',
        'niveau',
        'estPublic',
        'dateCreation',
        'dureeMinutes',
        'instructeur_id',
        'categorie_id'
    ];

    protected $casts = [
        'estPublic' => 'boolean',
        'dateCreation' => 'datetime',
        'prix' => 'float'
    ];

    public function instructeur()
    {
        return $this->belongsTo(Instructeur::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class, 'etudiant_cours')
            ->withTimestamps();
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function forums()
    {
        return $this->hasMany(Forum::class);
    }
}