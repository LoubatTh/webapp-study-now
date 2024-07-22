<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_public',
        'likes',
        'type',
        'tag_id',
        'user_id'
    ];

    protected $casts = [
        'name' => 'string',
        'is_public' => 'boolean',
        'likes' => 'integer',
        'type' => 'string',
        'tag_id' => 'integer',
        'user_id' => 'integer'
    ];

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flashcards()
    {
        return $this->hasMany(Flashcard::class);
    }

    public function userDecks()
    {
        return $this->hasMany(UserDeck::class);
    }
}
