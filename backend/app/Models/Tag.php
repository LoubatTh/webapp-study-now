<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $casts = [
        'name' => 'string',
    ];

    public function decks()
    {
        return $this->hasMany(Deck::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
