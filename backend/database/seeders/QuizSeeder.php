<?php

namespace Database\Seeders;

use App\Models\Quiz;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Quiz::factory()->create([
            "name" => "Trigo",
            "is_public" => true,
            "type" => "Quiz",
            "likes" => 0,
            "tag_id" => 1,
            "user_id" => 4,
        ]);

        Quiz::factory()->create([
            "name" => "Histoire",
            "is_public" => false,
            "type" => "Quiz",
            "likes" => 0,
            "tag_id" => 2,
            "user_id" => 4,
        ]);

        Quiz::factory()->create([
            "name" => "Littérature",
            "is_public" => false,
            "type" => "Quiz",
            "likes" => 0,
            "tag_id" => 4,
            "user_id" => 4,
        ]);

        Quiz::factory()->create([
            "name" => "Géographie",
            "is_public" => true,
            "type" => "Quiz",
            "likes" => 0,
            "tag_id" => 3,
            "user_id" => 4,
        ]);
    }
}