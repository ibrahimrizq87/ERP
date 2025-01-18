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
        Schema::create('shift_machines', function (Blueprint $table) {
            $table->id();
            $table->integer('open_amount'); 
            $table->integer('close_amount'); 
            $table->string('close_image'); 

            $table->integer('total_liters_amount'); 
            $table->decimal('total_money', 15, 6); 



            $table->unsignedBigInteger('shift_id'); 
            $table->foreign('shift_id')->references('id')->on('shifts')->onDelete('cascade');
            $table->unsignedBigInteger('product_id'); 
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            $table->unsignedBigInteger('machine_id'); 
            $table->foreign('machine_id')->references('id')->on('machines')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_machines');
    }
};
