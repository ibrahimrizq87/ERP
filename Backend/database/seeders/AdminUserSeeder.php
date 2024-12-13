<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'admin',
            'username' => 'admin',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

}
