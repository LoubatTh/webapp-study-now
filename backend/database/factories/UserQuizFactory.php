<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserQuiz>
 */
class UserQuizFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $next_repetition = $this->faker->numberBetween(0, 5);
        $is_liked = $this->faker->boolean();

        return [
            'user_id' => User::factory(),
            'quiz_id' => Quiz::factory(),
            'next_repetition' => $next_repetition,
            'is_liked' => $is_liked,
        ];
    }
}
