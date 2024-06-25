<?php

namespace Database\Factories;

use App\Models\Deck;
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
        $name = $this->faker->name();
        $visibility = $this->faker->randomElement(["Public", "Private", "Limited"]);
        $likes = $this->faker->numberBetween(0, 1000);

        return [
            "name" => $name,
            "visibility" => $visibility,
            "likes" => $likes
        ];
    }
}
