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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->string('opening_image', 10, 2);
            $table->decimal('opening_amount', 10, 2);
            $table->string('ending_image', 10, 2)->nullable();
            $table->decimal('ending_amount', 10, 2)->nullable();
            $table->enum('shift',['1' , '2']);
            $table->enum('status',['open' , 'closed']);

            $table->decimal('amount', 10, 2)->default(0.00);
            $table->decimal('total_money', 10, 2)->default(0.00);
            $table->decimal('total_cash', 10, 2)->default(0.00);
            $table->decimal('total_payed_online', 10, 2)->default(0.00);
            $table->decimal('total_client_deposit', 10, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
