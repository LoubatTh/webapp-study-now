<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'isPublic',
        'isOrganization',
        'likes',
        'type',
        'tag_id',
        'owner'
    ];

    public function qcms(): HasMany
    {
        return $this->hasMany(Qcm::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner');
    }
}
