<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'isPublic',
        'isOrganization',
        'likes',
        'user_id'
    ];

    protected $casts = [
        'name' => 'string',
        'isPublic' => 'boolean',
        'isOrganization' => 'boolean',
        'likes' => 'integer',
        'user_id' => 'integer',
    ];

    // public function tag()
    // {
    //     return $this->belongsTo(Tag::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flashcards()
    {
        return $this->hasMany(Flashcard::class);
    }
}
