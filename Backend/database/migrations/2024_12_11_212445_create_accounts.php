<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_name')->unique();
            // $table->enum('account_type', [
            //     'bank_account', 
            //     'client', 
            //     'cash_box', 
            //     'management_expense', 
            //     'marketing_expense'
            // ]);
            $table->string('phone')->nullable();
            // $table->foreignId('parent_id')->constrained('accounts')->onDelete('cascade'); 
            $table->foreignId('parent_id')
      ->nullable()
      ->constrained('accounts')
      ->onDelete('cascade');

            $table->boolean('can_delete')->default(0);
            $table->decimal('current_balance', 15, 2)->default(0.00);
            $table->decimal('net_debit', 15, 2)->default(0.00);
            $table->decimal('net_credit', 15, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
