<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDeck extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'deck_id',
        'is_liked',
        'next_repetition',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'deck_id' => 'integer',
        'is_liked' => 'boolean',
        'next_repetition' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }

    public function results()
    {
        return $this->hasMany(UserDeckResults::class);
    }
}