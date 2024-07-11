<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tag::factory()->create([
            "name" => "Mathematics"
        ]);

        Tag::factory()->create([
            "name" => "History"
        ]);

        Tag::factory()->create([
            "name" => "Geography"
        ]);

        Tag::factory()->create([
            "name" => "French"
        ]);

        Tag::factory()->create([
            "name" => "English"
        ]);

        Tag::factory()->create([
            "name" => "Physics"
        ]);

        Tag::factory()->create([
            "name" => "Chemistry"
        ]);

        Tag::factory()->create([
            "name" => "Spanish"
        ]);

        Tag::factory()->create([
            "name" => "German"
        ]);

        Tag::factory()->create([
            "name" => "Music"
        ]);

        Tag::factory()->create([
            "name" => "Sports"
        ]);

        Tag::factory()->create([
            "name" => "Economics"
        ]);

        Tag::factory()->create([
            "name" => "Biology"
        ]);

        Tag::factory()->create([
            "name" => "Earth Sciences"
        ]);

        Tag::factory()->create([
            "name" => "Computer Science"
        ]);

        Tag::factory()->create([
            "name" => "Medicine"
        ]);

        Tag::factory()->create([
            "name" => "Architecture"
        ]);

        Tag::factory()->create([
            "name" => "General Culture"
        ]);

        Tag::factory()->create([
            "name" => "Civic Education"
        ]);

        Tag::factory()->create([
            "name" => "Art"
        ]);

        Tag::factory()->create([
            "name" => "Technology"
        ]);
    }
}
