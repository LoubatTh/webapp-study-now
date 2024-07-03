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
        $easiness_factor = $this->faker->randomFloat(2, 0, 5);
        $repetition = $this->faker->numberBetween(0, 5);
        $interval = $this->faker->numberBetween(0, 5);
        $date = $this->faker->dateTimeBetween('-2 years', 'now');
        $user_grade = $this->faker->randomFloat(2, 0, 5);
        $prev_user_grade = $this->faker->randomFloat(2, 0, 5);
        $is_liked = $this->faker->boolean();

        return [
            'user_id' => User::factory(),
            'deck_id' => Deck::factory(),
            'easiness_factor' => $easiness_factor,
            'repetition' => $repetition,
            'interval' => $interval,
            'date' => $date,
            'user_grade' => $user_grade,
            'prev_user_grade' => $prev_user_grade,
            'is_liked' => $is_liked,
        ];
    }
}