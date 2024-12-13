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
        Schema::create('payment_documents', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2); 
          
            $table->enum('type', ['payment', 'receipt']); 
            $table->unsignedBigInteger('user_id'); 
            $table->string('receiver_name'); 
            $table->unsignedBigInteger('company_account_id'); 
            $table->unsignedBigInteger('customer_account_id'); 
            $table->string('image')->nullable(); 

            $table->foreign('company_account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->foreign('customer_account_id')->references('id')->on('accounts')->onDelete('cascade');


            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_documents');
    }
};
