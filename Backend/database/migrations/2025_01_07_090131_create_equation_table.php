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
        Schema::create('equations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collection_id'); 
            $table->unsignedBigInteger('base_id');
            
            $table->decimal('first_price', 15, 2); 
            $table->decimal('current_price', 15, 2); 

            $table->integer('number_of_periods')->defult(0); 
       
            $table->foreign('collection_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('base_id')->references('id')->on('accounts')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equations');
    }
};
