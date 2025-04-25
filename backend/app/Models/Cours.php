<?php
// app/Models/Cours.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'titre', 'description', 'prix', 'niveau',
        'estPublic', 'dateCreation', 'dureeMinutes',
        'categorie_id', 'instructeur_id'
    ];

    protected $casts = [
        'estPublic' => 'boolean',
        'dateCreation' => 'datetime',
    ];

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function instructeur()
    {
        return $this->belongsTo(Instructeur::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function ressources()
    {
        return $this->hasMany(Ressource::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function forums()
    {
        return $this->hasMany(Forum::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class, 'inscriptions');
    }

    public function panierItems()
    {
        return $this->hasMany(PanierItem::class);
    }

    public function paniers()
    {
        return $this->belongsToMany(Panier::class, 'panier_items');
    }
}
