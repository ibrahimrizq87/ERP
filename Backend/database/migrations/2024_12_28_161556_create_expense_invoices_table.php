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
        Schema::create('expense_invoices', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->decimal('total_cash', 10, 2); 
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->foreignId('expense_id')->constrained('accounts')->onDelete('cascade');
            $table->enum('payment_type',['cash' ,'online']);
            $table->string('note')->nullable();
            $table->string('online_payment_image')->nullable();
            $table->string('tax_amount');
            $table->string('tax_rate');
            $table->string('invoice_image')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_invoices');
    }
};
