<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TagSeeder::class,
            PersoUserSeeder::class,
            QuizSeeder::class,
            QcmSeeder::class,
            UserSeeder::class,
        ]);
    }
}
