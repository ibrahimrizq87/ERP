<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->delete();
        
        DB::table('settings')->insert([


            [
                'id' => 1,
                'key' => 'phone',
                'value' => '01234568789',

                'created_at' => now(),
                'updated_at' => now(),
            ], 
            [
                'id' => 2,
                'key' => 'logo',
                'value' => 'none',

                'created_at' => now(),
                'updated_at' => now(),
            ], 

            [
                'id' => 3,
                'key' => 'address',
                'value' => 'العنوان الافتراضى',

                'created_at' => now(),
                'updated_at' => now(),
            ], 


            [
                'id' => 4,
                'key' => 'tax_number',
                'value' => '555-555-555',

                'created_at' => now(),
                'updated_at' => now(),
            ], 

            [
                'id' => 5,
                'key' => 'tax_name',
                'value' => 'السجل التجارى الالافتراضى',

                'created_at' => now(),
                'updated_at' => now(),
            ], 
            [
                'id' => 6,
                'key' => 'invoice_message',
                'value' => 'المبلغ شامل ضريبة القيمة المضافة',

                'created_at' => now(),
                'updated_at' => now(),
            ], 
        ]);

    }
}
