<?php

namespace Database\Factories;

use App\Models\Deck;
use App\Models\Flashcard;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Flashcard>
 */
class FlashcardFactory extends Factory
{
    protected $model = Flashcard::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $wordsNum = $this->faker->numberBetween(5, 10);
        $question = $this->faker->sentence($wordsNum);
        $answer = $this->faker->word();

        return [
            "deck_id" => Deck::factory(),
            "question" => $question,
            "answer" => $answer
        ];
    }
}