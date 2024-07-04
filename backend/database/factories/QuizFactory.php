<?php

namespace Database\Factories;

use App\Models\Qcm;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();
        $isPublic = $this->faker->boolean();
        $likes = $this->faker->numberBetween(0, 1000);

        return [
            "name" => $name,
            "isPublic" => $isPublic,
            "type" => "Quiz",
            "likes" => $likes,
            "owner" => User::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($quiz) {
            $qcms = $this->faker->numberBetween(1, 20);

            Qcm::factory()->count($qcms)->create(["quiz_id" => $quiz->id]);
        });
    }
}