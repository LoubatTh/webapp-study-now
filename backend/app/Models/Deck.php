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
        'is_organization',
        'likes',
        'type',
        'user_id'
    ];

    protected $casts = [
        'name' => 'string',
        'is_public' => 'boolean',
        'is_organization' => 'boolean',
        'likes' => 'integer',
        'type' => 'string',
        'user_id' => 'integer'
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
