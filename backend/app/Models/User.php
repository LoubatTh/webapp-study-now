<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Billable, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'subscribed'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'users_organizations', 'user_id', 'organization_id');
    }

    public function decks()
    {
        return $this->hasMany(Deck::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function likedQuizzes()
    {
        return $this->belongsToMany(Quiz::class, 'user_quizzes')
            ->wherePivot('is_liked', true);
    }

    public function likedDecks()
    {
        return $this->belongsToMany(Deck::class, 'user_decks', 'user_id', 'deck_id')
            ->wherePivot('is_liked', true);
    }
}
