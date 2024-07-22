<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserQuiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'is_liked',
        'next_repetition',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'quiz_id' => 'integer',
        'is_liked' => 'boolean',
        'next_repetition' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function results()
    {
        return $this->hasMany(UserQuizResults::class);
    }
}
