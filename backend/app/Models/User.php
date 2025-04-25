<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   use Notifiable;

    protected $fillable = [
        'nom', 'email', 'password', 'role',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function administrateur()
    {
        return $this->hasOne(Administrateur::class);
    }

    public function instructeur()
    {
        return $this->hasOne(Instructeur::class);
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function panier()
    {
        return $this->hasOne(Panier::class)->where('is_active', true);
    }

    public function paniers()
    {
        return $this->hasMany(Panier::class);
    }

    // Helper method to check if user is admin
    public function isAdmin()
    {
        return $this->role === 'administrateur';
    }

    // Helper method to check if user is instructor
    public function isInstructeur()
    {
        return $this->role === 'instructeur';
    }

    // Helper method to check if user is student
    public function isEtudiant()
    {
        return $this->role === 'etudiant';
    }
}
