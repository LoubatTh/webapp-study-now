<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(10)
            ->hasDecks(10) // 100 decks
            ->hasQuizzes(10) //100 quizzes
            ->create();

        User::factory()
            ->count(5)
            ->hasDecks(3) // 15 decks
            ->hasQuizzes(6) //30 quizzes
            ->create();

        User::factory()
            ->count(6)
            ->hasDecks(20)  // 120 decks
            ->hasQuizzes(10) //60 quizzes
            ->create();

        User::factory()
            ->count(20)
            ->hasDecks(5) // 100 decks
            ->hasQuizzes(3) //60 quizzes
            ->create();

        User::factory()
            ->count(30)
            ->hasDecks(1) // 30 decks
            ->hasQuizzes(2) //60 quizzes
            ->create();

        // print "Start long creation\n";
        // for ($i = 0; $i < 300; $i++) {
        //     if ($i % 25 == 0) {
        //         print ("$i user created\n");
        //     }
        //     User::factory()
        //         ->hasDecks(20)
        //         ->hasQuizzes(20)
        //         ->create();
        // }
    }
}