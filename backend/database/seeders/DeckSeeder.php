<?php

namespace Database\Seeders;

use App\Models\Deck;
use Illuminate\Database\Seeder;

class DeckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Deck::factory()
            ->count(40)
            ->hasFlashcards(10)
            ->create();

        Deck::factory()
            ->count(100)
            ->hasFlashcards(20)
            ->create();

        Deck::factory()
            ->count(200)
            ->hasFlashcards(15)
            ->create();

        Deck::factory()
            ->count(2)
            ->hasFlashcards(2)
            ->create();
    }
}
