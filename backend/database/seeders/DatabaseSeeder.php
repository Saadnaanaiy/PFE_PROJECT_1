<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Administrateur;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Create the admin user
        $user = User::factory()->create([
            'nom'   => 'admin',
            'email' => 'admin@gmail.com',
            'role'  => 'administrateur',
            'image' => 'administrateurs/admin.jpg',
        ]);

        // 2) Seed the administrateurs table
        Administrateur::create([
            'user_id' => $user->id,
            // you can override image here if desired
            'image'   => $user->image,
        ]);
    }
}
