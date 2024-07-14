<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationQuiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'quiz_id',
        'file_path'
    ];

    protected $casts = [
        'organization_id' => 'integer',
        'quiz_id' => 'integer',
        'file_path' => 'string',
        'created_at' => 'date',
        'updated_at' => 'date',
    ];

    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    public function quiz() {
        return $this->belongsTo(Quiz::class);
    }
}
