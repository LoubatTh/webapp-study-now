<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\OrganizationDeck;
use App\Models\OrganizationQuiz;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organization = Organization::factory()->create([
            'name' => "Epitech",
            'description' => "Computer science school for the elite",
            'owner_id' => 4,
        ]);
        $organization->save();
        $organization->users()->attach([2, 5, 6, 7, 8]);

        OrganizationDeck::create([
            'deck_id' => 8,
            'organization_id' => $organization->id,
        ]);

        OrganizationDeck::create([
            'deck_id' => 9,
            'organization_id' => $organization->id,
        ]);

        OrganizationQuiz::create([
            'quiz_id' => 3,
            'organization_id' => $organization->id,
        ]);

        OrganizationQuiz::create([
            'quiz_id' => 4,
            'organization_id' => $organization->id,
        ]);

        OrganizationQuiz::create([
            'quiz_id' => 5,
            'organization_id' => $organization->id,
        ]);
    }
}