<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'visibility', 'likes'];

    public function qcms(): HasMany
    {
        return $this->hasMany(Qcm::class);
    }
}
