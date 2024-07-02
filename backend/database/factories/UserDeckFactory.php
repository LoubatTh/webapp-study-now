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
        $easinessFactor = $this->faker->randomFloat(2, 0, 5);
        $repetition = $this->faker->numberBetween(0, 5);
        $interval = $this->faker->numberBetween(0, 5);
        $date = $this->faker->dateTimeBetween('-2 years', 'now');
        $userGrade = $this->faker->randomFloat(2, 0, 5);
        $prevUserGrade = $this->faker->randomFloat(2, 0, 5);
        $isLiked = $this->faker->boolean();

        return [
            'user_id' => User::factory(),
            'deck_id' => Deck::factory(),
            'easinessFactor' => $easinessFactor,
            'repetition' => $repetition,
            'interval' => $interval,
            'date' => $date,
            'userGrade' => $userGrade,
            'prevUserGrade' => $prevUserGrade,
            'isLiked' => $isLiked,
        ];
    }
}