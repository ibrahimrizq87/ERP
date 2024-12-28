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
        Schema::create('purchase_invoices', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->decimal('price', 10, 2); 
            $table->integer('amount_letters');
            $table->decimal('total_cash', 10, 2); 
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained('accounts')->onDelete('cascade');
            $table->enum('payment_type',['cash' ,'online']);
            $table->string('note')->nullable();
            $table->string('online_payment_image')->nullable();
            $table->string('tax_amount');
            $table->string('tax_rate');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_invoices');
    }
};
