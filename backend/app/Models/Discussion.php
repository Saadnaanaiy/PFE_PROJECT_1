<?php
// app/Models/Discussion.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = [
        'sujet',
        'dateCreation',
        'forum_id'
    ];

    protected $casts = [
        'dateCreation' => 'datetime'
    ];

    public function forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}