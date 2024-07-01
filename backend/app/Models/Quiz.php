<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_public', 'is_organization', 'likes', 'owner'];

    public function qcms(): HasMany
    {
        return $this->hasMany(Qcm::class);
    }
}
