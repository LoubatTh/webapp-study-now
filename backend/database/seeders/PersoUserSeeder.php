<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PersoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->hasDecks(2)->hasQuizzes(2)->create();
        $user->delete();

        $password = "password";
        $user = User::factory()->create([
            'name' => 'Yolann',
            'email' => 'morellet.victor@neuf.fr',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();

        $user = User::factory()->create([
            'name' => 'UserTest',
            'email' => 'test@test.fr',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();
    }
}