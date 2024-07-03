<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\Qcm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Qcm>
 */
class QcmFactory extends Factory
{
    protected $model = Qcm::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $wordsNum = $this->faker->numberBetween(5, 10);
        $question = $this->faker->sentence($wordsNum);
        $answer1 = $this->faker->word();
        $answer2 = $this->faker->word();
        $answer3 = $this->faker->word();
        $answer4 = $this->faker->word();

        return [
            "quiz_id" => Quiz::factory(),
            "question" => $question,
            "answers" => [$answer1, $answer2, $answer3, $answer4],
        ];
    }
}