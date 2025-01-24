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
        Schema::create('product_moves', function (Blueprint $table) {
            $table->id();
            $table->enum('type',['from_us' , 'to_us']); 
            $table->integer('liters'); 
            $table->decimal('total_price', 16, 5);
            $table->date('date');
            $table->unsignedBigInteger('product_id'); 
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->unsignedBigInteger('main_shift_id')->nullable();
            $table->foreign('main_shift_id')->references('id')->on('main_shifts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_moves');
    }
};
