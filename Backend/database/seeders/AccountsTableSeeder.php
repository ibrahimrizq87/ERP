<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('accounts')->insert([
            [
                // 'id' => 1,
                'account_name' => 'الخزينه',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                // 'id' => 2,

                'account_name' => 'الزبائن',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                // 'id' => 3,

                'account_name' => 'الموردين',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                // 'id' => 4,

                'account_name' => 'حسابات البنوك',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                // 'id' => 5,

                'account_name' => 'حساب المصاريف العمومية و الادارية',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                // 'id' => 6,

                'account_name' => 'حساب المصاريف التسويقية',
                'phone' => null,
                'parent_id' => null, 
                'can_delete' => 0,
                'current_balance' => 0.00,
                'net_debit' => 0.00,
                'net_credit' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
