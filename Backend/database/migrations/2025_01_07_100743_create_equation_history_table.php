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
        Schema::create('equation_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('equation_id'); 
            
            $table->decimal('last_price', 15, 2); 
            $table->decimal('current_price', 15, 2); 

            $table->decimal('amount', 15, 2); 
       
            $table->integer('year'); 
            $table->integer('period_number'); 

            $table->foreign('equation_id')->references('id')->on('equations')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equation_histories');
    }
};
