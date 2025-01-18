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
        Schema::create('main_shifts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('worker_id'); 
            $table->unsignedBigInteger('supervisor_id')->nullable(); 

          
            // $table->integer('total_liters_amount'); 

            // $table->integer('total_liters_amount_clients'); 
            // $table->integer('total_liters_amount_online'); 
            $table->enum('status',['open' , 'closed' , 'approved']);
            $table->enum('shift',['1' , '2']);

            $table->decimal('total_shift_money', 15, 6); 
            $table->decimal('total_money_cash', 15, 6); 
            $table->decimal('total_money_client', 15, 6); 
            $table->decimal('total_money_online', 15, 6); 

            $table->string('online_image')->nullable(); 

            $table->date('date');

            $table->foreign('worker_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('main_shifts');
    }
};
