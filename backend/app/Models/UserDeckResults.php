<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDeckResults extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_deck_id',
        'grade',
        'interval',
        'easiness_factor',
        'repetition',
    ];

    protected $casts = [
        'user_deck_id' => 'int',
        'grade' => 'int',
        'interval' => 'int',
        'easiness_factor' => 'float',
        'repetition' => 'int',
    ];

    public function userDeck()
    {
        return $this->belongsTo(UserDeck::class);
    }
}
