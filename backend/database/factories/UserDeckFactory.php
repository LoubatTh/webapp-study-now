<?php

namespace Database\Factories;

use App\Models\Deck;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserDeck>
 */
class UserDeckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
        $is_liked = $this->faker->boolean();

        return [
            'user_id' => User::factory(),
            'deck_id' => Deck::factory(),
            'is_liked' => $is_liked,
        ];
    }
}