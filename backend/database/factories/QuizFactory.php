<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use app\Models\Quiz;
use app\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{

    protected $model = Quiz::class; 
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();
        $isPublic = $this->faker->boolean();
        $isOrganization = $this->faker->boolean();
        $likes = 0;
        
        

        return [
            "name" => $name,
            "isPublic" => $isPublic,
            "isOrganization" => $isOrganization,
            "likes" => $likes,
            "owner" => User::factory()
        ];
    }
}
