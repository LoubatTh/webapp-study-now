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
        'easiness_factor',
        'repetition',
        'interval',
        'date',
        'user_grade',
        'prev_user_grade',
        'is_liked',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'quiz_id' => 'integer',
        'easiness_factor' => 'float',
        'repetition' => 'integer',
        'interval' => 'integer',
        'date' => 'date',
        'user_grade' => 'float',
        'prev_user_grade' => 'float',
        'is_liked' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
