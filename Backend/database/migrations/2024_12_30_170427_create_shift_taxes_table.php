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
        Schema::create('shift_taxes', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('shift_id')->constrained('shifts')->onDelete('cascade');
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
        Schema::dropIfExists('shift_taxes');
    }
};
