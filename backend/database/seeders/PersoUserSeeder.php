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
        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Victor',
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

        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Nathan',
            'email' => 'nathan.dulac@epitech.eu',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();

        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Steven',
            'email' => 'steven.dorion@epitech.eu',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();

        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Matteo',
            'email' => 'matteo.degano@epitech.eu',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();

        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Thomas',
            'email' => 'thomas.loubat@epitech.eu',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();

        $user = User::factory()->hasDecks(4)->create([
            'name' => 'Scott',
            'email' => 'john.fitzgerald@epitech.eu',
            'password' => $password ??= Hash::make('password'),
        ]);
        $user->save();
    }
}