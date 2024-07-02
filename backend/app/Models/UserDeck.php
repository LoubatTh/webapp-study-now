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
        'easinessFactor',
        'repetition',
        'interval',
        'date',
        'userGrade',
        'prevUserGrade',
        'like',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'deck_id' => 'integer',
        'easinessFactor' => 'float',
        'repetition' => 'integer',
        'interval' => 'integer',
        'date' => 'date',
        'userGrade' => 'float',
        'prevUserGrade' => 'float',
        'isLiked' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }
}