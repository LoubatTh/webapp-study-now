<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Qcm extends Model
{
    use HasFactory;

    protected $fillable = ['question', 'answers'];
    protected $casts = ['answers' => 'array'];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}
