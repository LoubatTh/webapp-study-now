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
        'quiz_id' => 'integer',
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

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
