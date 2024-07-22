<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserQuizResults extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_quiz_id',
        'grade',
        'max_grade',
        'interval',
        'easiness_factor',
        'repetition',
    ];

    protected $casts = [
        'user_quiz_id' => 'int',
        'grade' => 'int',
        'max_grade' => 'int',
        'interval' => 'int',
        'easiness_factor' => 'float',
        'repetition' => 'int',
    ];

    public function userQuiz()
    {
        return $this->belongsTo(UserQuiz::class);
    }
}
