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
        Schema::create('sales_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('address')->nullable();
            $table->string('tax_no')->nullable();
            $table->string('tax_name')->nullable();
            $table->string('client_name')->nullable();
            $table->string('phone')->nullable();
            $table->enum('type',['cash' ,'debit']);
            $table->date('date');
            $table->integer('liters'); 
            $table->decimal('amount', 15, 6); 
            $table->decimal('tax_amount', 15, 6); 
            $table->decimal('tax_rate', 3, 2); 
            $table->string('number');
            $table->unsignedBigInteger('account_id')->nullable(); 
            $table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');
            $table->unsignedBigInteger('main_shift_id'); 
            $table->foreign('main_shift_id')->references('id')->on('main_shifts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_invoices');
    }
};
