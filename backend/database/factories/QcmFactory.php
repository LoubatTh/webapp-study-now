<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Qcm;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Qcm>
 */
class QcmFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $question = $this->faker->name();
        $answers = [
            [
                'answer' => $this->faker->name(),
                'isValid' => $this->faker->boolean()
            ],
            [
                'answer' => $this->faker->name(),
                'isValid' => $this->faker->boolean()
            ],
            [
                'answer' => $this->faker->name(),
                'isValid' => $this->faker->boolean()
            ],
            [
                'answer' => $this->faker->name(),
                'isValid' => $this->faker->boolean()
            ]
        ];
        
        return [
            "question" => $question,
            "answers" => $answers
        ];
    }
}
