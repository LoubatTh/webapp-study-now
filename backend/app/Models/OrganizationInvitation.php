<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrganizationInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'user_id',
    ];

    protected $casts = [
        'organization_id' => 'integer',
        'user_id' => 'integer',
        'created_at' => 'date'
    ];

    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
