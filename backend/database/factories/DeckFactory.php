<?php

namespace Database\Factories;

use App\Models\Deck;
use App\Models\Flashcard;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deck>
 */
class DeckFactory extends Factory
{
    protected $model = Deck::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->word();
        $is_public = $this->faker->boolean();
        $likes = $this->faker->numberBetween(0, 1000);
        $tag_id = $this->faker->numberBetween(1, 21);

        return [
            "name" => $name,
            "is_public" => $is_public,
            "likes" => $likes,
            "type" => "Deck",
            "tag_id" => $tag_id,
            "user_id" => User::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($deck) {
            if (count($deck['flashcards']) == 0) {
                $flashcards = $this->faker->numberBetween(1, 10);

                Flashcard::factory()->count($flashcards)->create(["deck_id" => $deck->id]);
            }
        });
    }
}