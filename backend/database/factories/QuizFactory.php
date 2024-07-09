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
        $name = $this->faker->word();
        $is_public = $this->faker->boolean();
        $is_organization = $this->faker->boolean();
        $likes = $this->faker->numberBetween(0, 1000);
        $tag_id = $this->faker->numberBetween(1, 21);

        return [
            "name" => $name,
            "is_public" => $is_public,
            "is_organization" => $is_organization,
            "type" => "Quiz",
            "likes" => $likes,
            "tag_id" => $tag_id,
            "owner" => User::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($quiz) {
            $qcms = $this->faker->numberBetween(1, 20);

            if ($quiz->id <= 2) {
                Qcm::factory()->count($qcms)->create(["quiz_id" => $quiz->id]);
            }
        });
    }
}