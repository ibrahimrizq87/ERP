<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tax_rate')->delete();

        DB::table('tax_rate')->insert([
            'id'=>1,
            'rate' => 15,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
