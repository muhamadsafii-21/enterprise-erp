<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Otomatis untuk Login
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin ERP',
                'password' => Hash::make('password'), // Password-nya: password
            ]
        );

        // 2. Jalankan Seeder ERP yang kita buat tadi
        $this->call([
            ErpDummySeeder::class,
            SalesOrderSeeder::class,
        ]);
    }
}
